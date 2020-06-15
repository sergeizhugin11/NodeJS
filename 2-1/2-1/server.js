var http = require('http');
var fs = require('fs');
//2.
let s = '';
var server = http.createServer(function (req, resp) {

                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write('<h1>XUI</h1>');

    resp.end(s += `url = ${req.url}`);

});
//5.
server.listen(3000);

console.log('Server Started listening on 5050');