const WebSocket = require('ws');

let parm0 = process.argv[0];
let parm1 = process.argv[1];
let parm2 = process.argv[2];

const ws = new WebSocket('ws:/localhost:6000/broadcast');

ws.on('open', () => {
    let prfx = typeof parm2 == 'undefined' ? 'A' : parm2;
    let k = 0;
    setInterval(() => {
        ws.send(`client: ${prfx}-${++k}`);
    }, 1000);
    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    })
    setTimeout(() => { ws.close() }, 25000);
});