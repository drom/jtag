'use strict';

const rules = require('./svf-rules');

module.exports = jtag => {
    let tail = '';
    let state = 'space';
    let firstChunk = true;
    let next;
    let END = {
        DR: 'IDLE',
        IR: 'IDLE'
    };
    let extra = {
        H: {
            DR: {len: 0, dat: '00'},
            IR: {len: 0, dat: '00'}
        },
        T: {
            DR: {len: 0, dat: '00'},
            IR: {len: 0, dat: '00'}
        }
    };
    let _R = '';
    let bitLen = 0;
    let tmp = '';
    let freq = 500e3;
    let oldState = 'any';

    const HTIDR = (key1, key2) =>
        async m => {
            const len = parseInt(m[1], 10) || 0;
            let dat = m[2] || '00';
            if (dat.length & 0x1) {
                dat = '0' + dat;
            }
            extra[key1][key2] = {len: len, dat: dat};
            state = 'space';
        };

    const on = {
        default: async () => { state = 'space'; },
        space:  async m => { state = m[1]; },
        ENDDR:  async m => { END.DR = m[1]; state = 'spacelog'; },
        ENDIR:  async m => { END.IR = m[1]; state = 'space'; },
        HDR:    HTIDR('H', 'DR'),
        HIR:    HTIDR('H', 'IR'),
        TDR:    HTIDR('T', 'DR'),
        TIR:    HTIDR('T', 'IR'),
        // FREQUENCY: async m => {
        //     freq = Number(m[1]);
        //     state = 'space';
        // },
        STATE: async m => {
            state = 'space';
            const newState = m[1];
            await jtag.TMS(oldState, newState);
            oldState = newState;
        },
        RUNTEST: async m => {
            state = 'space';
            const time = Number(m[4]);
            const bits = time * freq;
            const newState = m[1];
            await jtag.TMS(oldState, newState);
            oldState = newState;
            await jtag.TCK(bits);
            // await sleep(t * 1000);
        },
        SIR: async m => {
            state = 'TDI';
            _R = 'IR';
            tmp = '';
            bitLen = parseInt(m[1], 10);
            await jtag.TMS(oldState, END.IR);
            const newState = 'IRSHIFT';
            await jtag.TMS(END.IR, newState);
            oldState = newState;
        },
        SDR: async m => {
            state = 'TDI';
            _R = 'DR';
            tmp = '';
            bitLen = parseInt(m[1], 10);
            await jtag.TMS(oldState, END.DR);
            const newState = 'DRSHIFT';
            await jtag.TMS(END.DR, newState);
            oldState = newState;
        },
        TDI: async m => {
            const part = m[1];
            if (part !== undefined) {
                tmp += part;
            } else {
                const io = (m[2] !== undefined) ? false : true;
                // TODO check (m[3] !== undefined)
                const head = extra.H[_R];
                const tail = extra.T[_R];
                await jtag.TDI(head.dat, head.len, io, 0);
                await jtag.TDI(tmp, bitLen, io, ((tail.len > 0) ? 0 : 1));
                await jtag.TDI(tail.dat, tail.len, io, 1);
                tmp = '';
                const newState = END[_R];
                await jtag.TMS(_R + 'PAUSE', newState);
                oldState = newState;
                state = 'space';
            }
        }
    };

    const parse = () => {
        const pattern = rules[state] || rules.default;
        const m = tail.match(pattern);
        if (m === null) {
            next();
            return;
        }
        const i = m.index;
        const body = m[0];
        tail = tail.slice(i + body.length);
        (on[state] || on.default)(m).then(parse).catch(err => {
            console.log(err);
        });
    };

    return (chunk, env, _next) => {
        tail += chunk;
        next = _next;
        if (firstChunk) {
            firstChunk = false;
            jtag.open().then(parse);
            return;
        }
        parse();
    };
};
