const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:4000/');
socket.on('open',ws=>{
    let date = new Date();
    setInterval(()=>{
	date = new Date();
        socket.send(JSON.stringify({client: 'client', timestamp: date.getMilliseconds()}));
    },5000);
});
socket.onmessage = message =>{
    console.log(message.data);
};