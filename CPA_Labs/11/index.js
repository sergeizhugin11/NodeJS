const express = require('express');
app = express();
const WebSocket = require('ws');
const fs = require('fs');
const socket = new WebSocket.Server({
    port: 4000,
    host: 'localhost'
});
// socket.on('connection', (ws) => {
//     const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
//     let wfile = fs.createWriteStream('./upload/qwe.txt');
//     duplex.pipe(wfile);
// });
socket.on('connection', (ws) => {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let rfile = fs.createReadStream('./upload/qwe.txt');
    rfile.pipe(duplex);
});

