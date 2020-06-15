var http = require('http');
var url = require('url');
var fs = require('fs');
var parseString = require('xml2js').parseString;


console.log('Server running at http://localhost:5000/');
http.createServer(function (request, response) {
    if (request.method == 'GET') {
        if (url.parse(request.url).pathname === '/') {
            response.statusCode = '201';
            response.end(JSON.stringify({ data: "09-01" }));
        }
        else if (url.parse(request.url).pathname === '/second') {
                
            response.end(JSON.stringify({ data: "09-02 " + url.parse(request.url, true).query.x + ", " + url.parse(request.url, true).query.y }));
        }
        else if (url.parse(request.url).pathname === '/eighth') {
            let html = fs.readFileSync(__dirname + '/MyFile.txt');
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end(html);
        }   
    }
    else if (request.method == 'POST') {
        if (url.parse(request.url).pathname === '/third') {
            request.on('data', (data) => {
                console.log(data);
                response.end(JSON.stringify({ data: "09-03 Params: " + JSON.parse(data).x + ", " + JSON.parse(data).y + ", " + JSON.parse(data).s }));
            })
        }
        else if (url.parse(request.url).pathname === '/fourth') {
            request.on('data', (data) => {
                let {
                    comment: comment,
                    x: x,
                    y: y,
                    s: s,
                    m: m,
                    o: o
                } = JSON.parse(data);
                response.end(JSON.stringify({
                    __comment: 'Response. ' + comment,
                    x_plus_y: x + y,
                    concat_s_o: s + ': ' + o.surname + ', ' + o.name,

                }));
            });
        }
        else if (url.parse(request.url).pathname === '/fifth') {
            request.on('data', (data) => {
                let sum = 0;
                let concat = '';
                let idS = '';
                console.log(data.toString());
                parseString(data.toString(), function (err, result) {
                    idS = result.request.$.id;
                    result.request.x.map((e, i) => {
                        sum += Number(e.$.value);
                    })
                    result.request.m.map((e, i) => {
                        concat += e.$.value;
                    })
                })
                response.setHeader('Content-Type', 'text/xml');
                let responseText = `<response id="33" request="${idS}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                response.end(responseText);
            })
        }
        else if (url.parse(request.url).pathname === '/sixth') {
            request.on('data', (data) => {
                console.log(data.toString());
                response.end(data);
            })
        }
        else if (url.parse(request.url).pathname === '/seventh') {
            request.on('data', (data) => {
                console.log(data.toString());
                response.end(data);
            })
        }
        else if (url.parse(request.url).pathname === '/eighth') {
            let html = fs.readFileSync(__dirname + '/MyFile.txt');
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end(html);
        }
    }
}).listen(5000);