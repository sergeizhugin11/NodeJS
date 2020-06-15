const WebSocket = require('ws');
const socket = new WebSocket.Server({
    port:4000,
    host:'localhost',
    path:'/'
});

socket.on('connection',ws=>{
   let duplex = WebSocket.createWebSocketStream(socket,{encoding : 'utf-8'});
    let date = new Date();
   ws.on('message', data=>{
       date = new Date();
       console.log(data);
       ws.send(JSON.stringify({server : 'server', client:data, timestamp:date.getMilliseconds()}))
   });
});
