let http = require('http');
let fs =  require('fs');

http.createServer(function (request,response) {

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.write('<h1>norm</h1>')
      process.stdin.setEncoding('utf8');
      process.stdin.on('readable', () => {
        let chunk ='norm';
          while ((chunk = process.stdin.read()) !== null) {
              switch (chunk.trim()) {
                  case 'norm':
                      process.stdout.write('Application change state on norm');
                      response.write('<h1>norm</h1>');
                      break;
                  case 'stop':
                      process.stdout.write('Application change state on stop');
                      response.write('<h1>stop</h1>');
                      break;
                  case 'test':
                      process.stdout.write('Application change state on test');
                      response.write('<h1>test</h1>');
                      break;
                  case 'idle':
                      process.stdout.write('Application change state on idle');
                      response.write('<h1>idle</h1>');
                      break;
                  case 'exit':
                      process.exit(0);
                      break;
                  default: process.stdout.write('Incorrect state of application: ' + chunk);
              }
          }
      });

}).listen(5000);

console.log('Server running at http://localhost:5000');