const JsonRPCServer = require('jsonrpc-server-http-nats');

const server = new JsonRPCServer();

server.on('sum', (params, channel, response)=>{
    let sum = params.reduce((a, b) => a + b, 0);
    response(null, sum);
});

server.on('mul', (params, channel, response)=>{
    let mul = params.reduce((a, b) => a * b, 1);
    response(null, mul);
});

server.on('div', (params, channel, response)=>{
    let {x, y} = params;
    let div = x/y;
    response(null, div);
});

server.on('proc', (params, channel, response)=>{
    let {x, y} = params;
    let result = 100*x/y;
    response(null, result);
});

server.listenHttp({ host: '127.0.0.1', port: 1337 }, () => {console.log('Server Running on port 1337')})