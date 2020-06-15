const WebSocket = require('ws');
const fs = require('fs');
const socket = new WebSocket('ws://localhost:4000');
socket.on('open',(ws)=>{
   const duplex = WebSocket.createWebSocketStream(socket,{encoding:'utf8'});
   let rfile = fs.createReadStream('./upload/ert.txt');
   rfile.pipe(duplex);
});