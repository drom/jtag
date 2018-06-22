'use strict';

module.exports = f => {
    const div = Math.round(30e6 / f) - 1;
    return [
        0x85, // loopback off
        0x8a, // disable clock/5
        0x97, // Turn off adaptive clocking (may be needed for ARM)
        0x8D, // Disable three-phase clocking
        0x86,
        div & 0xff,
        (div >> 8) & 0xff
    ];
};
