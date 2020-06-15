var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (request, response) => {
    require('./m0603')('Test m0603 from npm install');
    response.end();
});


app.listen(5000);

console.log('Server running at http://localhost:5000/');
