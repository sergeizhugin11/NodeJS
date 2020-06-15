'use strict';
var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./data.js');
var port = process.env.PORT || 1234;
var readline = require('readline');

var db = new data.DB();

db.on('GET', (req, res) => { console.log('DB.GET'); res.end(JSON.stringify(db.get())); });
db.on('POST', (req, res) => { console.log('DB.POST'); req.on('data', data => { let r = JSON.parse(data); db.post(r); res.end(JSON.stringify(r)); }) });

db.on('DELETE', (req, res) => { console.log('DB.DELETE'); req.on('data', data => { let r = JSON.parse(data); db.delete(r); res.end(JSON.stringify(r)); }) });
db.on('PUT', (req, res) => { console.log('DB.PUT'); req.on('data', data => { let r = JSON.parse(data); db.put(r); res.end(JSON.stringify(r)); }) });
db.on('COMMIT', () => { db.commit(); });
db.on('STAT', (date) => {
    console.log(JSON.stringify(db.getStatistics(date)));
});

http.createServer(function (request, response)
{
    if(url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('04-02.html');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);    
    }
    else if(url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response)
    }
    else if (url.parse(request.url).pathname === '/api/ss') {
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    }

}).listen(port);

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '-->'
});
var timerId = 0;
var intervalId = 0;
var statId = 0;

rl.prompt();
rl.on('line', (line) => {
    var oper = line.split(' ');
    var param = parseInt(oper[1], 10);
    switch (oper[0]) {
        case 'sd':
            if (param) {
                if (timerId != 0)
                    clearTimeout(timerId);
                timerId = setTimeout(() => { process.exit(0); }, param * 1000);
            } else {
                clearTimeout(timerId);
                console.log('parm doesnt exists');
                timerId = 0;
            }
            break;
        case 'sc':
            if (param) {
                intervalId = setInterval(() => { db.emit('COMMIT'); }, param * 1000);
                //intervalId.unref();
            } else {
                clearInterval(intervalId);
                console.log('parm doesnt exists');
            }
            break;
        case 'ss':
            if (param) {
                let start = Date.now();

                var interval = setInterval(() => { console.log('...statistics calculation...') }, 2000);
                interval.ref();
                statId = setTimeout(() => {
                    db.emit('STAT', (new Date()).toJSON());
                    console.log(`calculation stopped: ${Date.now() - start}`);
                    clearInterval(interval)
                }, param * 1000);
            } else {
                clearTimeout(statId);
            }
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('error operation!');
            break;
    }
    rl.prompt();
});