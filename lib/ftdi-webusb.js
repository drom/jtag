'use strict';

const ftd = require('./ftdi-flags');
// const mv = require('./ftdi-jtag-state-change');
const initMPSSE = require('./ftdi-mpsse-init');
const fdiv = require('./ftdi-mpsse-divider');
// const str2buf = require('./str2buf');

module.exports = dev => {

    const cfgOut = async (bRequest, wValue) => {
        await dev.controlTransferOut({
            requestType: 'vendor', // ftd.FTDI_REQTYPE_OUT,
            recipient: 'interface', // ftd.FTDI_IFC_A,
            request: bRequest,  // vendor-specific request: enable channels
            value: wValue,  // 0b00010011 (channels 1, 2 and 5)
            index: 0
        });
    };

    const datOut = async buf => {
        if (buf === undefined) { throw new Error(); }
        const len = buf.length;
        let abuf = new ArrayBuffer(len);
        let view = new Uint8Array(abuf);
        for (let i = 0; i < len; i++) {
            view[i] = buf[i];
        }
        await dev.transferOut(0, abuf);
    };

    const init = async () => {
        await cfgOut(ftd.FTDI_CTL_RESET, 0);
        await cfgOut(ftd.FTDI_CTL_SET_BITMODE, 0x0000);
        await cfgOut(ftd.FTDI_CTL_SET_BITMODE, 0x0200);
        await cfgOut(ftd.FTDI_CTL_SET_EVENT_CH, 0);
        await cfgOut(ftd.FTDI_CTL_SET_ERROR_CH, 0);
        await datOut(fdiv(30e6).concat(initMPSSE));
    };

    return {
        cfgOut: cfgOut,
        init: init
    };
};
