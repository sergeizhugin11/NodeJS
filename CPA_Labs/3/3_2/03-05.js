const http = require('http');
const url = require('url');
const fs = require('fs');

var factorialTick = function(n) {
    if(n == 0) {
        return 1
    } else {
        return n * factorialTick(n - 1);
    }
}

class Fact {
    constructor (n, cb) {
        this.factorial = factorialTick;
        this.num = n;
        this.cb = cb;
    }

    calc() {
        setImmediate( ()=> {
            this.cb(null, this.factorial(this.num));
        });
    }
}

const server = http.createServer(function (request, response) {
    let rc = JSON.stringify({ k:0 });
    if (url.parse(request.url).pathname === '/fact') {
        if (typeof url.parse(request.url, true).query.k != 'undefined') {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {'Content-Type' : 'application/json'});
                let fact = new Fact(k, (error, result) => {
                    response.end( JSON.stringify({ k:k , fact : result }) );
                })
                fact.calc();
            }
        }
    }
    else if (url.parse(request.url).pathname === '/') {
        let page = fs.readFileSync('./03-03.html');
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
        response.end(page)
    }
    else {
        response.end(rc)
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/');