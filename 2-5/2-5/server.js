var http = require('http');
var fs = require('fs');
//2.
var server = http.createServer(function (req, resp) {
    //3.
    if (req.url === "/fetch") {
        fs.readFile("fetch.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            //resp.end();
        });
    }
    if (req.url === "/api/name") {
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>Zhuhin Siarhei</h1>');
        resp.end();
    }
});
//5.
server.listen(2020);

console.log('Server Started listening on 2020');