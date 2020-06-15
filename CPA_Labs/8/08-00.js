const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const xmlParse = require('xml2js').parseString;
const mp = require('multiparty');

const httpHandler = (req, res) => {
    if(req.method == 'GET'){
        getHandler(req, res);
    }
    else if(req.method == 'POST'){
        postHandler(req, res);
    }
    else res.end('404');
};

const getHandler = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    const sections = pathname.split('/');
    const query = url.parse(req.url, true).query;

    switch ('/' + sections[1]) {
        case '/connection':
            let key = Number(query['set']);
            if(Number.isInteger(key)){
                server.keepAliveTimeout = key;
            }
            res.end('Value KeepAliveTimeout: ' + server.keepAliveTimeout);                   
            break;

        case '/headers':
            res.setHeader('Client-Header','1');
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({
                requestHeaders: req.headers,
                responseHeaders: res.getHeaders()
            }));
            break;

        case '/parameter':
            let x, y;
            if (sections[2] && sections[3]){
                x = parseInt(sections[2]);
                y = parseInt(sections[3]);
            }
            else {
                x = Number(query['x']);
                y = Number(query['y']);
            }

            if(Number.isInteger(x) && Number.isInteger(y)){
                res.end('x+y='+(x+y)+
                        '\nx-y='+(x-y)+
                        '\nx*y='+(x*y)+
                        '\nx/y='+(x/y));
            }else{
                res.end('Error: values are not integers')
            }
            break;

        case '/close':
            const time = 10;
            res.end('Server will be closed after ' + time + ' seconds');
            setTimeout(() => { server.close();}, time * 1000);
            break;

        case '/socket':
            res.end('Client ip:'+ req.connection.remoteAddress+
                '\nClient port:' + req.connection.remotePort+
                '\nServer ip:' + req.connection.localAddress+
                '\nServer port:' +  req.connection.localPort
            );
            break;

        case '/resp-status':
            res.statusCode = query['code'];
            res.statusMessage = query['mess'];
            res.end();
            break;

        case '/formparameter':
            let html = fs.readFileSync(__dirname + '/static/form.html');
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end(html);
            break;

        case '/files':
            if (sections[2]){
                let filename = sections[2];
                fs.readFile(__dirname + '/static/' + filename, (err, data) => {
                    if (err) {
                        res.statusCode = 404;
                        res.end();
                    } else {
                        let file = fs.readFileSync(__dirname + '/static/' + filename);
			res.setHeader('Content-disposition', 'attachment');
                        res.end(file);
                    }
                })
                break;
            }

            fs.readdir( __dirname + '/static', (err, files) => {
                if (err)
                    res.statusCode = 500;
                res.setHeader('X-static-files-count', files.length);
                res.end();
            });
            break;

        case '/upload':
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end(fs.readFileSync(__dirname + '/upload.html'));
            break;

        default:
            break;
    }
};

const postHandler = (req, res) => {
    switch (url.parse(req.url).pathname) {
        case '/req-data':
            let chunks =  0;
            req.on('data', (chunk) => {
                console.log("NEW CHUNK!:" + chunk.toString());
                chunks++;
            }).on('end', () => {
                console.log('chunks are ended');
                console.log(chunks);
            });
            res.end();
            break;

        case '/formparameter':
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                var obj = qs.parse(data);
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify(obj));
            });
            break;

        case '/json':
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                let {
                    __comment: comment,
                    x: x,
                    y: y,
                    s: s,
                    m: m,
                    o: o
                } = JSON.parse(body);
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify({
                    __comment: comment.replace('Запрос','Ответ'),
                    x_plus_y: x + y,
                    Concatination_s_o: s + ': ' + o.surname + ', ' + o.name,
                    Length_m: m.length
                }));
            });
            
            break;

        case '/xml':
            let xmlBody = '';
            req.on('data', chunk => {
                xmlBody += chunk;
            });
            req.on('end', () => {
                xmlParse(xmlBody, (err, xml)=> {
                    res.setHeader('Content-Type', 'text/xml');
                    let sum = 0;
                    let concat = '';
                    xml.request.x.forEach(x => sum += Number(x.$.value));
                    xml.request.m.forEach(m => concat += m.$.value);
                    let responseText = `<response id="33" request="${xml.request.$.id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                    res.end(responseText);
                });   
            });
                   
            break;

        case '/upload':
            let directoryName = __dirname + '/static';
            let form = new mp.Form({uploadDir: directoryName});
            form.on('file', (name, file) => {
                console.log(file);
                fs.rename(file.path, directoryName + '/' + file.originalFilename, (err) =>{
                    if (err) console.log(err);
                });
            });
            form.on('close', () => {
                res.end('Uploaded');
            });
            form.parse(req);
            break;

        default:
            break;
    }
};

let server = http.createServer(httpHandler).listen(5000);

console.log('Server running at http://localhost:5000/');


/*
{
    "__comment": "Запрос.Лаба 8/10",
    "x": 1,
    "y": 2,
    "s": "Сообщение",
    "m": [
        "a",
        "b",
        "c",
        "d"
    ],
    "o": {
        "surname": "Сергей",
        "name": "Жугин"
    }
}
*/

/*
<request id= "28">
    <x value = "1"/>
    <x value = "2"/>
    <m value = "a"/>
    <m value = "b"/>
    <m value = "c"/>
</request>
*/
