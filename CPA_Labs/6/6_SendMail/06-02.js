const http = require('http');
const fs = require('fs');
const url = require('url');
const sendmail = require('sendmail')({silent: true});

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    if(url.parse(request.url).pathname === '/' && request.method == 'GET') {
        fs.readFile('./index.html', (err, data) => {
            response.end(data);
        });
    } else if (url.parse(request.url).pathname === '/' && request.method == 'POST') {
        let body = '';
        request.on('data', (chunk) => { body += chunk.toString(); });
        request.on('end', () => {
            let parm = JSON.parse(body);
            sendmail({
                from: parm.from,
                to: parm.to,
                subject: 'test',
                html: parm.text
            }, (err, reply) => {
                console.log(err && err.stack);
                console.dir(reply);
            });
            response.end('Status: OK.\nFrom: ' + parm.from + ' .\nTo: ' + parm.to + ' .\nText: ' + parm.text);
        });
    }
}).listen(3000);

console.log('Server running at http://localhost:3000/');