#!/usr/bin/env node
'use strict';

// const tty = require('tty');
const fs = require('fs');
const path = require('path');
// const http = require('http');
const yargs = require('yargs');
const request = require('request');
const svf = require('../lib/svf-stream');
const ftdi = require('../lib/ftdi-libusb');

const options = yargs
    .option('file', {
        alias: 'f',
        type: 'string',
        describe: 'input SVF file name'
    })
    .option('url', {
        alias: 'u',
        type: 'string',
        describe: 'input SVF URL'
    })
    .option('serial-number', {
        alias: 'n',
        type: 'string',
        describe: 'FTDI serial number'
    })
    .option('serial-div', {
        alias: 'd',
        type: 'string',
        describe: 'FTDI serial number divisor'
    })
    .version()
    .help()
    .argv;

// console.log(options);

let source;
if (process.stdin.isTTY) {
    if (options.file) {
        const fileName = path.resolve(process.cwd(), options.file);
        source = fs.ReadStream(fileName);
    } else
    if (options.url) {
        source = request(options.url);
    }
} else {
    source = process.stdin.setEncoding('ascii');
}

if (source) {
    const jtag = ftdi(options);
    const s1 = svf(jtag);

    source.pipe(s1).pipe(process.stdout);
} else {
    yargs.showHelp();
}
