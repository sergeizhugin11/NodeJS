var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (request, response) => {
    let html = fs.readFileSync('./mailer.html');
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
});

app.post('/', (request, response) => {
    let {
        from: from,
        to: to,
        message: message
    } = request.body;
    console.log(from + " " + to + " " + message);
    require('./nodeMailer')(from, to, message);
    response.end();
});

app.get('/send', (request, response) => {
    require('./m0603')('Message sent with module');
    response.end();
});

app.listen(5000);

console.log('Server running at http://localhost:5000/');