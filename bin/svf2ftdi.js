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
    .option('freq', {
        alias: 'h',
        type: 'number',
        describe: 'FTDI TCK frequency',
        default: 30e6
    })
    .option('channel', {
        alias: 'c',
        type: 'number',
        describe: 'FTDI channel',
        default: 0
    })
    .option('progress', {
        alias: 'p',
        boolean: true,
        describe: 'Show progress bar'
    })
    .version()
    .help()
    .argv;

let source;

if (options.file) {
    const fileName = path.resolve(process.cwd(), options.file);
    source = fs.ReadStream(fileName);
} else
if (options.url) {
    source = request
        .get(options.url)
        .on('error', function (error) {
            throw new Error(error);
        })
        .on('response', function (response) {
            // const contentType = response.headers['content-type']
            //     .split(';').map(e => e.trim());
            if (response.statusCode !== 200 /* || contentType[0] === 'text/html' */) {
                throw new Error(JSON.stringify({
                    status: response.statusCode,
                    'content-type': response.headers['content-type']
                }));
            }
            // console.log(response.statusCode, response.headers['content-type']);
        });
} else
if (process.stdin.isTTY) {
    source = process.stdin.setEncoding('ascii');
}

if (source) {
    const jtag = ftdi(options);
    const s1 = svf(jtag);

    source.pipe(s1).pipe(process.stdout);
} else {
    yargs.showHelp();
}
