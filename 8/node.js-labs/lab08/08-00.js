const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const xmlBodyParser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');

const app = express();

app.use(fileUpload({ createParentPath: true}));
app.use(xmlBodyParser({}));
app.use(bodyParser.json());

const server = app.listen(5000);
console.log('Server running at http://localhost:5000/');

app.get('/connection', (request, response)=>{
    let key = Number(request.query.set);
    if(Number.isInteger(key)){
        server.keepAliveTimeout = key;
    }
    response.end('Value KeepAliveTimeout: ' + server.keepAliveTimeout);
})

app.get('/headers', (request, response)=>{
    response.set('Client-Header','1');
    response.json({
        requestHeaders: request.headers,
        responseHeaders: response.getHeaders()
    });
})

app.get('/parameter', (request, response)=>{
    let x = Number(request.query.x);
    let y = Number(request.query.y);
    if(Number.isInteger(x) && Number.isInteger(y)){
        response.end('x+y='+(x+y)+
                    '\nx-y='+(x-y)+
                    '\nx*y='+(x*y)+
                    '\nx/y='+(x/y));
    }else{
        response.end('Error: values are not integers')
    }
})

app.get('/parameter/:x/:y', (request, response) => {
    let x = Number(request.params.x);
    let y = Number(request.params.y);
    if(Number.isInteger(x) && Number.isInteger(y)){
        response.end('x+y='+(x+y)+
                    '\nx-y='+(x-y)+
                    '\nx*y='+(x*y)+
                    '\nx/y='+(x/y));
    }else{
        response.end(`URI: ${request.host}:5000${request.url}`);
    }
});

app.get('/close', (request, response)=>{
    const time = 10;
    response.json('Server will be closed after ' + time + ' seconds');
    setTimeout(() => { server.close();}, time * 1000);
})

app.get('/socket', (request, response)=>{
    response.end('Client ip:'+ request.connection.remoteAddress+
        '\nClient port:' + request.connection.remotePort+
        '\nServer ip:' + request.connection.localAddress+
        '\nServer port:' +  request.connection.localPort
    );
})

app.get('/req-data', (request, response)=>{
    request.on('data', chunk => {
        console.log(`Data chunk available: ${chunk}`)
      })
      request.on('end', () => {
        //end of data
      })
})

app.get('/resp-status', (request, response)=>{
    response.statusCode = request.query.code;
    response.statusMessage = request.query.mess;
    response.end();
})

app.get('/formparameter', (request, response) => {
    response.sendFile(__dirname + '/static/form.html');
});
app.post('/formparameter', (request, response)=>{
    console.log(JSON.stringify(request.body));
    response.json(request.body);
})

app.post('/json', (request, response)=>{
    let {
        comment: comment,
        x: x,
        y: y,
        s: s,
        m: m,
        o: o
    } = request.body;
    response.json({
        __comment: 'Response. ' + comment,
        x_plus_y: x + y,
        Concatination_s_o: s + ': ' + o.surname + ', ' + o.name,
        Length_m: m.length
    });
})

app.post('/xml', (request, response)=>{
    let xml = request.body;
    response.setHeader('Content-Type', 'text/xml');
    let sum = 0;
    let concat = '';
    xml.request.x.forEach(x => sum += Number(x.$.value));
    xml.request.m.forEach(m => concat += m.$.value);
    let responseText = `<response id="33" request="${xml.request.$.id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
    response.end(responseText);
})

app.get('/files', (request, response)=>{
    fs.readdir( __dirname + '/static', (err, files) => {
        if (err)
            response.statusCode = 500;
        response.setHeader('X-static-files-count', files.length);
        response.end();
    });
})
app.get('/files/:filename', (request, response) => {
    let filename = request.params.filename;
    fs.readFile(__dirname + '/static/' + filename, (err, data) => {
        if (err) {
            response.statusCode = 404;
            response.end();
        } else {
            response.sendFile(__dirname + '/static/' + filename);
        }
    })
});

app.get('/upload', (request, response)=>{
    response.sendFile(__dirname + '/upload.html');
});
app.post('/upload', async (request, response) => {
    let uploadedFile = request.files.uploadedFile;
    uploadedFile.mv(__dirname + '/static/' + uploadedFile.name);
    response.end();
})