const http = require('http');
const fs = require('fs');
const url = require('url');
let state = 'norm';
let fact = (param)=>  {
    if(param === 0) {
        return 1;
    } else {
        return param * fact(param - 1);
    }
};
function Fact(n,cb){
    this.fn = n;
    this.ffact = fact;
    this.fcb = cb;
    this.call = () =>{
        process.nextTick(() => this.fcb(null, this.ffact(this.fn)))};
    this.callSetImmediate= ()=>{
       setImmediate(()=>{
           this.fcb(null,this.ffact(this.fn));
       });
    };
}
http.createServer(function(req,resp){
    switch(url.parse(req.url).pathname){
        case '/':
            resp.end(state);
            break;
        case '/fact':

            let k = parseInt(url.parse(req.url,true).query.k);
            if(!isNaN(k)) {

               resp.end(JSON.stringify({k: k, fact: fact(k)}));
            } else {
                resp.end('input correct value');
            }
            break;
        case '/factA':

            let kA = parseInt(url.parse(req.url,true).query.k);
            if(!isNaN(kA)) {
                let fact = new Fact(kA,(err,result)=>{resp.end(JSON.stringify({k:kA, fact: result}));});
                fact.call();
            } else {
                resp.end('input correct value');
            }
            break;
        case '/factASet':

            let kASet = parseInt(url.parse(req.url,true).query.k);
            if(!isNaN(kASet)) {
                let fact = new Fact(kASet,(err,result)=>{resp.end(JSON.stringify({k:kASet, fact: result}));});
                fact.callSetImmediate();
            } else {
                resp.end('input correct value');
            }
            break;
        case '/factSync':

            console.log(__dirname);
            let fetchHttp = fs.readFileSync(__dirname+"/index.html");
            resp.end(fetchHttp);
            break;
        case '/factAsync':

            console.log(__dirname);
            let httpA = fs.readFileSync(__dirname+"/indexAsync.html");
            resp.end(httpA);
            break;
        case '/factAsyncSet':

            console.log(__dirname);
            let httpASet = fs.readFileSync(__dirname+"/indexASet.html");
            resp.end(httpASet);
            break;
    }
}).listen(3000,()=>{
   console.log('server running at http://localhost:3000/')
});
process.stdin.setEncoding('utf-8');
process.stdin.on('readable',()=>{
    let chunk = 'norm';
    while((chunk = process.stdin.read())){
        if(chunk.trim() =='exit') process.exit(0);
        else if (chunk.trim()==='norm') state ='norm';
        else if (chunk.trim()==='stop') state = 'stop';
        else if(chunk.trim()==='test') state = 'test';
        else process.stdout.write(chunk.trim());
    }
});