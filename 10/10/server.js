'use strict';
var http = require('http');

http.createServer(function (req, res) {
    if (req.method === 'GET' && req.url === '/start')
    {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(require('fs').readFileSync('./09-01.html'));
    }
}).listen(3000);
console.log('http server: 3000');

let k = 0;
const WebSocket = require('ws');
const wsserver = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver' })
wsserver.on('connection', (ws) => {
    ws.on('message', message => {
        console.log(`Received message => ${message}`);
    })
    setInterval(() => { ws.send(`server: ${++k}`) }, 1500);
});
wsserver.on('error', (e) => {
    console.log('error:', e);
});
console.log('ws server: 4000');
