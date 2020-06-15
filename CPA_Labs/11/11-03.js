const WebSocket = require('ws');
const fs = require('fs');
const socket = new WebSocket.Server({
    port:4000,
    host:'localhost'
});
socket.on('connection',(ws)=>{
    let count = 1;
    let send = setInterval(()=>{
        ws.send(JSON.stringify({'11-03-server':count++}));
        ws.ping('ping');
        console.log(socket.clients.size);
    },5000);
    /*ws.on('pong',(data)=>{
        console.log(data.toString());
    });*/

});

const WebSocket = require('ws');
const socket = new WebSocket.Server({port:4000, host:'localhost'});
socket.on('connection', (ws)=>{
	let count = 1;
	let send = setInterval(()=>{
		ws.send(JSON.stringify({'11-03-server count': count++}));
		ws.ping('ping');
	});
})
