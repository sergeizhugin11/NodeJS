/*const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

let service = axios.create({
    baseURL: 'http://localhost:5000',
    responseType: "application/json"
});

service.get('/eighth')
.then(res=> {
    console.log('response: ', res.status);
    console.log('statusMessage: ', res.statusText);
    console.log('data: ' + JSON.stringify(res.data));
    console.log('response headers: ', res.headers);
});*/

let http = require('http');
let options = {
    host: 'localhost',
    path: '/eighth',
    port: 5000,
    method: 'GET',
    headers: { 'content-type': 'application/json;' }
};
let req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { console.log('Buffer lenght: ', Buffer.byteLength(data)); console.log(data.toString()); });
});
req.end();