'use strict';

// LSB first
const tms = (dat, len) => Buffer.from([0x4A, len - 1, dat]);

module.exports = {
    any: {
        IDLE:       tms(0b01111111, 8),
        RESET:      tms( 0b1111111, 7)
    },
    RESET: {
        IDLE:       tms(       0b0, 1)
    },
    IDLE: {
        RESET:      tms(     0b111, 3),
        IDLE:       tms(         0, 0),

        DRSELECT:   tms(       0b1, 1),
        DRCAPTURE:  tms(      0b01, 2),
        DRSHIFT:    tms(     0b001, 3),
        DREXIT1:    tms(     0b101, 3),
        DRPAUSE:    tms(    0b0101, 4),
        DREXIT2:    tms(   0b10101, 5),
        DRUPDATE:   tms(    0b1101, 4),

        IRSELECT:   tms(      0b11, 2),
        IRCAPTURE:  tms(     0b011, 3),
        IRSHIFT:    tms(    0b0011, 4),
        IREXIT1:    tms(    0b1011, 4),
        IRPAUSE:    tms(   0b01011, 5),
        IREXIT2:    tms(  0b101011, 6),
        IRUPDATE:   tms(   0b11011, 5)
    },
    // DR
    DRSHIFT: {
        DRPAUSE:    tms(      0b01, 2),
        IDLE:       tms(     0b011, 3)
    },
    DRPAUSE: {
        DRSHIFT:    tms(      0b01, 2),
        IRPAUSE:    tms( 0b0101111, 7),
        IDLE:       tms(     0b011, 3)
    },
    DREXIT1: {
        DRPAUSE:    tms(       0b0, 1),
        IDLE:       tms(      0b01, 2)
    },
    // IR
    IRSHIFT: {
        IRPAUSE:    tms(      0b01, 2),
        IDLE:       tms(     0b011, 3)
    },
    IRPAUSE: {
        IRSHIFT:    tms(      0b01, 2),
        DRPAUSE:    tms(  0b010111, 6),
        IDLE:       tms(     0b011, 3)
    },
    IREXIT1: {
        IRPAUSE:    tms(       0b0, 1),
        IDLE:       tms(      0b01, 2)
    }
};
