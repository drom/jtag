[![NPM version](https://img.shields.io/npm/v/jtag.ftdi.svg)](https://www.npmjs.org/package/jtag.ftdi)

JTAG / FTDI related JavaScript library and tools.

## Installation

Package can be installed from NPM

```sh
npm install jtag.ftdi --build-from-source=usb
```

The package depends on [node-usb](https://github.com/tessel/node-usb) that depends on `libusb` library that have to be installed:

#### Ubuntu
```
sudo apt-get install build-essential libudev-dev
```

#### OpenSuse
```
sudo zypper install libudev-devel libusb-1_0-devel
```

### SVF

[Serial Vector Format (SVF)](https://en.wikipedia.org/wiki/Serial_Vector_Format) is a text file format that contains sequence of JTAG operations.

### FTDI

FTDI
[FT232H](http://www.ftdichip.com/Products/ICs/FT232H.htm),
[FT2232H](http://www.ftdichip.com/Products/ICs/FT2232H.html),
[FT4232H](http://www.ftdichip.com/Products/ICs/FT4232H.htm)
is a series of USB 2.0 ICs that can be used for high speed serial communication protocols.

## Tools

### svf2ftdi

```sh
./node_modules/.bin/svf2ftdi

Options:
  --file, -f           input SVF file name                              [string]
  --url, -u            input SVF URL                                    [string]
  --serial-number, -n  FTDI serial number                               [string]
  --serial-div, -d     FTDI serial number divisor                       [string]
  --version            Show version number                             [boolean]
  --help               Show help                                       [boolean]
```

## Library

### svf-stream

Node.js Writable stream that parses input SVF text while calling JTAG driver.

```js
const svf = require('jtag.ftdi/lib/svf-stream');
const jtag = <JTAG driver>;
const s1 = svf(jtag);
source.pipe(s1);
```

### ftdi-libusb

Node.js component that implements JTAG protocol on `FTDI` IC over `libusb`.

```js
const ftdi = require('jtag.ftdi/lib/ftdi-libusb');
const jtag = ftdi(options);
...
```

### ftdi-webusb

WebUSB version of JTAG over FTDI driver.

```js
const ftdi = require('jtag.ftdi/lib/ftdi-webusb');
const jtag = ftdi(options);
...
```
