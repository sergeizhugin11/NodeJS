import express = require('express')
var port = process.env.port || 1337
var app = express();
import parseInt = require('parse-int');
import fs = require('fs');
import { url } from 'inspector';
var state = 'norm';
var strCMD = 'norm';

app.get('/', function (req, res)
{

    res.send('<h1> State : ' + state + '<h1>' + '<h2> string in console : ' + strCMD + '<h2>');
    process.stdin.setEncoding('utf-8');
    process.stdin.on('readable', () =>
    {
        let chunk = null;
        while ((chunk = process.stdin.read()) != null)
        {
            strCMD = chunk.trim();
            if (strCMD == 'exit')
            {
                process.exit(0);
            }
            else if (strCMD == 'test' || strCMD == 'norm' || strCMD == 'stop' || strCMD == 'idle')
            {
                process.stdout.write(state + '-->' + strCMD + '\n');
                state = strCMD;
            }
            else
            {
                process.stdout.write('incorrect state! ' + strCMD + '\n');
            }
            
        }
    });
});

app.get('/fetch', function (req, res)
{
    let html = fs.readFileSync('./fetch.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);

});

app.get('/fact', function (req, res)
{

    if (req.query.k >= 0) res.send(JSON.stringify({ k: req.query.k, facto: facto(req.query.k) }));

   else res.send('incorrect number');

});

app.get('/setImmediate', function (req, res)
{
    let fac = new Fac(req.query.k, (err, result) => { res.send(JSON.stringify({ k: req.query.k, facto: result })); });
    fac.c2();
});

app.get('/setImmediateHTML', function (req, res)
{
    let html = fs.readFileSync('./setImmediate.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

app.get('/nextTick', function (req, res)
{
    let fac = new Fac(req.query.k, (err, result) => { res.send(JSON.stringify({ k: req.query.k, facto: result })); });
    fac.c1();
});

app.get('/nextTickHTML', function (req, res)
{
    let html = fs.readFileSync('./nextTick.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

var fac = (num) => { return (num == 1 ? num : (num * fac(num - 1))); }

function Fac(n, cb)
{
    this.fn = n;
    this.ffac = fac;
    this.fcb = cb;
    this.c1 = () =>
    {
        process.nextTick(() => { this.fcb(null, this.ffac(this.fn)); });
    }
    this.c2 = () =>
    {
        setImmediate(() => { this.fcb(null, this.ffac(this.fn)); });
    }
}

function facto(num)
{
    if (num == 1) return num;
    else if (num == 0)
    {
        return '1';
    }
    else
    {
        return num * facto(num - 1) + '';
    }

}

app.listen(port, function () { console.log('success');})
