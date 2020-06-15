const WebSocket = require('ws');
const fs = require('fs');
const socket = new WebSocket('ws://localhost:4000');
socket.on('open',(ws)=>{
    const duplex = WebSocket.createWebSocketStream(socket,{encoding:'utf8'});
    duplex.pipe(process.stdout);
});
//setInterval(()=>{socket.ping('client ping')},4000);
socket.on('pong',(data)=>{
    console.log(data.toString());
});