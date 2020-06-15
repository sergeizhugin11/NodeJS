const http = require("http");
const fs = require("fs");
http.createServer(function (req, resp) {
    const filePathName = __dirname + '/image/image.jpg';
    switch (req.url) {
        case '/':
            resp.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            resp.end('main page');
            break;
        case '/html':
            let html = fs.readFileSync(__dirname + "/index.html");
            resp.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            resp.end(html);
            break;
        case '/jpg':
            let jpg = fs.readFileSync(filePathName);
            resp.writeHead(200, { 'Content-Type': 'image/jpeg; charset=utf-8' });
            resp.end(jpg, 'binary');
            break;
        case '/api/name':
            console.log(req.method);
            if (req.method === 'GET') {
                resp.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                resp.end("zhuhin siarhei");
            } else {
                console.log('method is not a GET');
            }
            break;
        case '/xmlhttprequest':
            resp.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let XmlHttp = fs.readFileSync(__dirname + "/xmlhttprequest.html");
            resp.end(XmlHttp);
            break;
        case '/fetch':
            resp.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let fetchHttp = fs.readFileSync(__dirname + "/fetch.html");
            resp.end(fetchHttp);
            break;
        case '/jquery':
            resp.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let jqueryHttp = fs.readFileSync(__dirname + "/jquery.html");
            resp.end(jqueryHttp);
            break;
        default:
            resp.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            console.log('404 page not found');
            resp.end('Page 404 not found');
    }
}).listen(5001);
console.log('server running at http://localhost:5000');