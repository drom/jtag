'use strict';

const stream = require('stream');
const parser = require('./svf-parser');

module.exports = jtag => {
    const s = stream.Duplex();
    s.state = 'space';
    s.log = function (str) { s.push(Buffer.from(str)); };
    s.on('error', err => {
        s.log('on error');
        throw err;
    });
    s.on('finish', jtag.close);
    s._write = parser(s)(jtag);
    s._read = function () {};
    return s;
};
