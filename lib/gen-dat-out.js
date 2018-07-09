'use strict';

module.exports = config => buf => {
    if (buf === undefined) { throw new Error(); }
    return new Promise((resolve, reject) => {
        buf = Buffer.from(buf);
        config.epOut.transfer(buf, err => {
            if (err) { reject(err); }
            resolve();
        });
    });
};
