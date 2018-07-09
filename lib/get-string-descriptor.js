'use strict';

module.exports = (dev, iSerialNumber) =>
    new Promise(resolve => {
        dev.getStringDescriptor(iSerialNumber, (err, buf) => {
            resolve(buf);
        });
    });
