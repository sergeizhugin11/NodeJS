let app = require('express')();
let https = require('https');
let fs = require('fs');

let options = {
	key: fs.readFileSync('LAB.key').toString(),
	cert: fs.readFileSync('LAB.crt').toString(),
};

https.createServer(options, app).listen(3443);

app.use((req, res, next)=>{
	console.log('2012');
	next();
});

app.get('/', (req, res, next)=>{
	console.log('2013');
	res.end('laba ykradena');
})