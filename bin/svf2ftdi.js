#!/usr/bin/env node
'use strict';

const svf = require('../lib/svf-stream');
const ftdi = require('../lib/ftdi-libusb');

const jtag = ftdi();
const s1 = svf(jtag);

process.stdin
    .setEncoding('ascii')
    .pipe(s1)
    .pipe(process.stdout);
