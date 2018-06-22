'use strict';

module.exports = (head, body) => {
    if (head.length & 0x1) {
        throw new Error('uneven number of nibles in the HEX string (head)');
    }
    const headLen = head.length >> 1;

    if (body.length & 0x1) {
        throw new Error('uneven number of nibles in the HEX string (body)');
    }
    const bodyLen = body.length >> 1;

    let buf = Buffer.from(head + body, 'hex');

    let j = headLen + bodyLen - 1;
    const ilim = headLen + (bodyLen >> 1);
    for (let i = headLen; i < ilim; i++) {
        const tmp = buf[j];
        buf[j] = buf[i];
        buf[i] = tmp;
        j -= 1;
    }
    return buf;
};
