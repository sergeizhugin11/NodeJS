/*const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

let service = axios.create({
    baseURL: 'http://localhost:5000',
    responseType: "application/json"
});

const formData = new FormData();
formData.append(
    'pngFile',
    fs.createReadStream(__dirname + '/MyFile.png'),
    {knownLength: fs.statSync(__dirname + '/MyFile.png').size}
);

service.post('/seventh', formData,{
    headers: {
        ...formData.getHeaders(),
        "Content-Length": formData.getLengthSync()
    }
})
.then(res=>{
    console.log('response: ', res.status);
    console.log('statusMessage: ', res.statusText);
    console.log('data: ' + JSON.stringify(res.data));
});*/

let http = require('http');
let fs = require('fs');

let bound = 'smw60-smw60-smw60';
/*let body = `--${bound}\r\n`;
body += 'Content-Disposition:form-data; name="file"; filename="D:\\Node JS\\9\\9\\MyFile.txt"\r\n';
body += 'Content-Type:application/octet-stream\r\n\r\n';*/
let options = {
    host: 'localhost',
    path: '/sixth',
    port: 5000,
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data; boundary=' + bound }
};
let req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { console.log('Buffer lenght: ', Buffer.byteLength(data)); console.log(data.toString()); });
});
//req.write(body);
let stream = new fs.ReadStream("D:\\Node JS\\9\\9\\MyFile.png");
stream.on('data', (chunk) => { req.write(chunk); console.log(Buffer.byteLength(chunk)) });
stream.on('end', () => { req.end(`\r\n--${bound}--\r\n`) });