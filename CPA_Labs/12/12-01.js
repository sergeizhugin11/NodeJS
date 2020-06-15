const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const RPCWebSocket = require('rpc-websockets').Server;
const http = require('http');
const url = require('url');
const FILE_NAME = '/StudentsList.json';
app.use(bodyParser());
const socket = new RPCWebSocket({
    port: 4000,
    host: 'localhost',
    path: '/'
});
socket.event('changed');
http.createServer((req, res) => {
    console.log(url.parse(req.url).pathname, 'Urla');
    console.log(url.parse(req.url).pathname.split('/').length);
   if(req.method==='GET' && req.url==='/') {
       fs.readFile(__dirname+FILE_NAME,(err,data)=>{
           if(err) {
               console.log(err.message)
           } else {
               console.log(JSON.parse(data));
               res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
               res.end(JSON.stringify(JSON.parse(data)));
           }
       })
       // how to add parameter /:n !!!!!
   } else if (req.method==='GET' && url.parse(req.url).pathname.split('/').length === 2 && !isNaN(url.parse(req.url).pathname.split('/')[url.parse(req.url).pathname.split('/').length - 1]) ) {
       console.log(url.parse(req.url).pathname.split('/'));
	console.log('2');
        let n = url.parse(req.url).pathname.split('/')[1];
        n = Number(n);
        console.log(n);
        console.log(typeof n);
        fs.readFile(__dirname+FILE_NAME,(err,data)=>{
            if(err) {
                console.log(err.message);
                res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                res.end(JSON.stringify({'error':1, 'message': `Ошибка чтения файла ${__dirname+FILE_NAME}`}));
            } else {
                let users = JSON.parse(data);
                for (let i = 0; i < users.length; i++) {
                    if(users[i].id===n) {
                        res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
                        res.end(JSON.stringify(users[i]));
                    } else {
                        res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                        res.end(JSON.stringify({'error':2, 'message': `студент с id ${n} не найден`}));                    }
                }
            }
        })
   } else if (req.method==='POST' &&  url.parse(req.url).pathname ==='/') {
        fs.readFile(__dirname+FILE_NAME,(err,data)=>{
        if(err) {
            console.log(err.message);
            res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
            res.end(JSON.stringify({'error':1, 'message': `Ошибка чтения файла ${__dirname+FILE_NAME}`}));
        } else {
            let users = JSON.parse(data.toString());
            req.on('data',(body)=>{
                let user = JSON.parse(body.toString());
                let counter = 0;
                for (let i = 0; i < users.length; i++) {
                    if(user.id===users[i].id) {
                        counter++;
                    } else {
                    }
                }
                if(counter===0)
                {
                    users.push(user);
                    fs.writeFile(__dirname+FILE_NAME,JSON.stringify(users),(err)=>{
                        if(err){
                            console.log(err.message);
                        } else {
                            console.log("write in file async");
                            socket.emit('changed');
                            res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
                            res.end(JSON.stringify(user));
                        }
                    });
                } else {
                    res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                    res.end(JSON.stringify({'error':3, 'message': `студент с id ${user.id} уже есть`}));
                }
            });
        }
   });
   } else if(req.method==='PUT' && url.parse(req.url).pathname ==='/' ) {
       fs.readFile(__dirname + FILE_NAME, (err, data) => {
           if (err) {
               console.log(err.message);
               res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
               res.end(JSON.stringify({'error':1, 'message': `Ошибка чтения файла ${__dirname+FILE_NAME}`}));
            } else {
                let users = JSON.parse(data.toString());
                req.on('data',(body)=>{
                let user = JSON.parse(body.toString());
                let q = users.findIndex(i => i.id === user.id);
                if (q !== -1) {
                    console.log(q);
                    for (let i = 0; i < users.length; i++) {

                        users[i].name = user.name;
                        users[i].bday = user.bday;
                        users[i].speciality = user.speciality;
                    }
                    fs.writeFile(__dirname + FILE_NAME, JSON.stringify(users), (err) => {
                        if (err) {
                            console.log(err.message);
                            res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                            res.end(JSON.stringify({'error':1, 'message': `Ошибка чтения файла ${__dirname+FILE_NAME}`}));
                        } else {
                            // socket.emit('changing');
                            console.log("write in file async");
                            res.end(JSON.stringify(user));
                        }
                    });
            }
            else {
                    res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
                    res.end(JSON.stringify({'error':2, 'message': `студент с id ${user.id} не найден`}));
                }
        });
       }
   })
} else if(req.method==='DELETE' && url.parse(req.url).pathname.split('/')[0] === ''
       && url.parse(req.url).pathname.split('/')[1] !== 'backup') {
       let users = require('./StudentsList');
       let n = url.parse(req.url).pathname.split('/')[1];
       n = Number(n);
       console.log(n);
       console.log(typeof n);
       let get = users.findIndex(s=>s.id===n);
       console.log(get);
       if(get ===-1) {
           res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
           res.end(JSON.stringify({'error':2, 'message': `студент с id ${n} не найден`}));
       } else {
       users.splice(get,1);
       console.log(users);
       fs.writeFile(__dirname + FILE_NAME,JSON.stringify(users),err => {
           if(err) {
                console.log(err.message);
            } else {
            res.end(JSON.stringify({"complete":`user  with id: ${n} deleted`}));
        }
    });
    }
   } else if (req.method ==='POST' && url.parse(req.url).pathname==='/backup') {
       setTimeout(()=>{
           const date = new Date();
           let backupFilePath = __dirname+'/backup/'
               + date.getFullYear() + '-'
               + (date.getMonth()+1) + '-'
               + (date.getDate()) + '-'
               + date.getHours() + '-'
               + date.getMinutes() + '-'
               + date.getSeconds() + '-'
               + 'StudentsList.json';
           fs.copyFile(__dirname +FILE_NAME,backupFilePath,err => {
               if(err) {
                   res.writeHead(500, {"Content-Type": "application/json; charset=utf-8;"});
                   res.end(JSON.stringify({'error':1, 'message': `Ошибка чтения файла ${__dirname+FILE_NAME}`}));
               }
               res.end();
       })
   },2000);
   } else if (req.method ==='DELETE' && url.parse(req.url).pathname.split('/')[1]==='backup') {
            fs.readdir(__dirname+'/backup', (err, files) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({error: err.message}));
                    throw err;
                }
                let providedBackupDate = url.parse(req.url).pathname.split('/')[2];
                let year = '', month = '', day = '';
                for (let i = 0; i < providedBackupDate.length; i++) {
                    if (i < 4) {
                        year += providedBackupDate.charAt(i);
                    } else if (i < 6) {
                        month += providedBackupDate.charAt(i);
                    } else {
                        day += providedBackupDate.charAt(i);
                    }
                }
                console.log('year',year);
                console.log('month',month);
                console.log('day',day);
                providedBackupDate = new Date(Number(year), Number(month), Number(day));
                console.log(providedBackupDate);
                files.forEach(file => {
                    let dateParams = file.split('-').splice(0, 6);
                    let backupDate = new Date(
                        Number(dateParams[0]),
                        Number(dateParams[1]),
                        Number(dateParams[2]),
                        Number(dateParams[3]),
                        Number(dateParams[4]),
                        Number(dateParams[5])
                    );
                    console.log('backupdate',backupDate);
                    if (providedBackupDate > backupDate) {
                        fs.unlink(__dirname+'/backup/' + file, err => {
                            if (err) {
                                res.statusCode = 500;
                                res.end(JSON.stringify({error: err.message}));
                                throw err;
                            }
                        })
                    }
                });
                res.end();
            });
   } else if (req.method ==='GET' && url.parse(req.url).pathname==='/backup') {
       console.log(__dirname+'/backup/');
        fs.readdir(__dirname+'/backup/',(err,items)=>{
            let json = [];
            for (let i = 0; i <items.length ; i++) {
                json.push( items[i]);
                console.log(items[i]);
            }
            console.log(json);
            res.end(JSON.stringify(json));
        });

   } else {
       res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
       res.end();
   }
}).listen(5000,()=>{
    console.log('http://localhost:5000/')
});