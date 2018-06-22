#!/usr/bin/env node
'use strict';

const usb = require('usb');

usb.getDeviceList().some(dev => {
    if (dev.deviceDescriptor.idVendor === 0x0403) {
        dev.open();
        const if0 = dev.interfaces[0];
        if (if0.isKernelDriverActive()) {
            if0.detachKernelDriver();
        }
        dev.close();
    }
});
