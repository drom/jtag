'use strict';

const util = require('../../lib/ftdi-webusb');

const filters = { filters: [{ vendorId: 0x0403 }]};

const btn = document.getElementById('connect');

btn.addEventListener('click', async () => {
    const dev = await navigator.usb.requestDevice(filters);
    await dev.open();
    console.log(dev);
    if (dev.configuration === null) {
        await dev.selectConfiguration(1);
    }
    const if0 = dev.configurations[0].interfaces[0];
    if (!if0.claimed) {
        await dev.claimInterface(0);
    }
    console.log(if0);
    const u = util(dev);
    await u.init();
    // const epIn = if0.endpoints[0]; // (0x81);
    // epOut = if0.endpoints[1]; //(0x02);

});

/* global navigator document */
