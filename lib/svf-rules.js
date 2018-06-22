'use strict';

const word = /^\s*(\w+)\s*;/;
const tdiOrNot = /^\s*\d+\s*;|^\s*(\d+)\s+TDI\s*\(([0-9A-Fa-f]+)\)\s*;/;
const tdi = /^\s*(\d+)\s+(TDI)\s*\(\s*/;

module.exports = {
    space:  /^\s*(!|HDR|HIR|TDR|TIR|ENDDR|ENDIR|FREQUENCY|STATE|SIR|SDR|RUNTEST)\s*/,
    SIR:    tdi,
    SDR:    tdi,
    TDI:    /^\s*([0-9A-Fa-f]+)\s*|^\s*\)\s*(;)\s*|^\s*\)\s*(TDO)\s*\(\s*([0-9A-Fa-f]+)\s*\)\s*(MASK)\s*\(\s*([0-9A-Fa-f]+)\s*\)\s*;/,
    ENDDR:  word,
    ENDIR:  word,
    STATE:  word,
    HDR:    tdiOrNot,
    HIR:    tdiOrNot,
    TDR:    tdiOrNot,
    TIR:    tdiOrNot,
    RUNTEST: /^\s*(\w+)\s+(\d+)\s+(\w+)\s+([\d.E-]+)\s+(\w+)\s*;/,
    FREQUENCY: /^\s*([\deE.+-]+)\s+(HZ)\s*;/,
    '!':    /\n/,
    default: /;/
};
