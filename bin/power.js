#!/usr/bin/env node
'use strict';

const usb = require('usb');
const ftd = require('../lib/ftdi-flags');

const sleep = time => new Promise((resolve) => setTimeout(resolve, time));

const getStringDescriptor = (dev, iSerialNumber) =>
    new Promise((resolve, reject) => {
        dev.getStringDescriptor(iSerialNumber, (err, buf) => {
            if (err) { reject(err); }
            resolve(buf);
        });
    });

const genCfgOut = dev => (bRequest, wValue) =>
    new Promise(resolve =>
        dev.controlTransfer(
            ftd.FTDI_REQTYPE_OUT,
            bRequest,
            wValue,
            ftd.FTDI_IFC_A,
            Buffer.from([]),
            err => {
                if (err) { throw err; }
                resolve();
            }
        ));

const genDatOut = epOut => buf => {
    if (buf === undefined) { throw new Error(); }
    return new Promise(resolve => {
        epOut.transfer(buf, err => {
            if (err) { throw err; }
            resolve();
        });
    });
};

const init = async (dev, epOut) => {
    const cfgOut = genCfgOut(dev);
    const datOut = genDatOut(epOut);

    await cfgOut(ftd.FTDI_CTL_RESET, 0);
    await cfgOut(ftd.FTDI_CTL_SET_BITMODE, 0x0000);
    await cfgOut(ftd.FTDI_CTL_SET_BITMODE, 0x0200);
    await cfgOut(ftd.FTDI_CTL_SET_EVENT_CH, 0);
    await cfgOut(ftd.FTDI_CTL_SET_ERROR_CH, 0);
    //                     val          dir
    await datOut([0x85, 0x8a, 0x97, 0x8D, 0x86, 0xff, 0xff]); console.log('0');
    await sleep(500);
    await datOut([0x80, 0b00000000, 0b11111111]); console.log('1');
    await sleep(1000);
    await datOut([0x80, 0b11111111, 0b11111111]); console.log('2');
    await sleep(1500);
    await datOut([0x80, 0b00000000, 0b11111111]); console.log('3');
};

const main = async () => {
    const devices = usb.getDeviceList();
    for (let i = 0; i < devices.length; i++) {
        const dev = devices[i];
        if (dev.deviceDescriptor.idVendor === 0x0403) {
            dev.open();
            // const iSerialNumber = dev.deviceDescriptor.iSerialNumber;
            // const str = await getStringDescriptor(dev, iSerialNumber);
            // if (str === 'FT2P00TF') {
            const if1 = dev.interfaces[0];
            const epOut = if1.endpoints[0]; //(0x02);
            if (if1.isKernelDriverActive()) { if1.detachKernelDriver(); }
            if1.claim();
            await init(dev, epOut);
            // }
            dev.close();
        }
    }
};

main();
