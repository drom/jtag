'use strict';

const ftd = require('../lib/ftdi-flags');

module.exports = config => (bRequest, wValue) =>
    new Promise((resolve, reject) =>
        config.dev.controlTransfer(
            ftd.FTDI_REQTYPE_OUT,
            bRequest,
            wValue,
            ftd.FTDI_IFC_A,
            Buffer.from([]),
            err => {
                if (err) { reject(err); }
                resolve();
            }
        ));
