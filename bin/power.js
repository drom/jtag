#!/usr/bin/env node
'use strict';

const usb = require('usb');
const ftd = require('../lib/ftdi-flags');
const initMPSSE = require('../lib/ftdi-mpsse-init');
const fdiv = require('../lib/ftdi-mpsse-divider');
const genCfgOut = require('../lib/gen-cfg-out');
const genDatOut = require('../lib/gen-dat-out');

const sleep = time => new Promise((resolve) => setTimeout(resolve, time));

let config = {};

const cfgOut = genCfgOut(config);
const datOut = genDatOut(config);

const init = async () => {
    await cfgOut(ftd.FTDI_CTL_RESET, 0);
    await cfgOut(ftd.FTDI_CTL_SET_BITMODE, 0x0000);
    await cfgOut(ftd.FTDI_CTL_SET_BITMODE, 0x0200);
    await cfgOut(ftd.FTDI_CTL_SET_EVENT_CH, 0);
    await cfgOut(ftd.FTDI_CTL_SET_ERROR_CH, 0);
    await datOut(fdiv(1e6).concat(initMPSSE));
};


const main = async () => {
    const devices = usb.getDeviceList();
    for (let i = 0; i < devices.length; i++) {
        let dev = devices[i];
        if (dev.deviceDescriptor.idVendor === 0x0403) {
            dev.open();
            config.dev = dev;
        }
    }

    const interf = config.dev.interfaces[0];
    config.epIn = interf.endpoints[0]; // (0x81);
    config.epOut = interf.endpoints[1]; //(0x02);

    if (interf.isKernelDriverActive()) {
        interf.detachKernelDriver();
    }

    interf.claim();
    await init();
    await datOut([0x80, 0b00000000, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b00000001, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b00000010, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b00000100, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b00001000, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b00010000, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b00100000, 0b11111111]); await sleep(10);
    await datOut([0x80, 0b01000000, 0b11111111]); await sleep(10);
    config.dev.close();
};

main();
