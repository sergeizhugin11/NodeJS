const rpcWSS = require('rpc-websockets').Server;
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const students = require('./StudentList');

const server = new rpcWSS({port:4000, host:'localhost'});
const app = express();
app.use(bodyParser.json());

const FILE_PATH = './StudentList.json';
const BACKUP_DIR_PATH = './backup/';

server.event('Changed!');

app.get('/', (req, res)=>{
    res.json(students);
});

app.get('/backup', (req, res) => {
    fs.readdir(BACKUP_DIR_PATH, ((err, files) => {
        let list = [];
        files.forEach(async file => {
            list.push({name:(BACKUP_DIR_PATH + file).toString()});
        });
        res.json(list);
    }));
});

app.get('/:n', (req, res)=>{
    let student = students.find(s => s.id == req.params.n);
    if (student) {
        res.json(student);
    } else {
        res.statusCode = 404;
        res.json({error: 'No such student with provided id was found'});
    }
});

app.post('/', (req, res)=>{
    let {
        id: id,
        name: name,
        birth: birth,
        speciality: speciality
    } = req.body;
    if (students.find(s => s.id == id)) {
        res.statusCode = 400;
        res.json({error: 'Such student is already exists'});
    } else {
        let student = {id: id, name: name, birth: birth, speciality: speciality};
        students.push(student);
        fs.writeFile(FILE_PATH, JSON.stringify(students, null, '  '), () => {});
        res.json(student);
    }
});

app.put('/', (req, res)=>{
    let {
        id: id,
        name: name,
        birth: birth,
        speciality: speciality
    } = req.body;
    let studentIndex = students.findIndex(s => s.id == id);
    if (studentIndex != -1) {
        let newStudent = {id: id, name: name, birth: birth, speciality: speciality};
        let oldStudent = students[studentIndex];
        Object.keys(oldStudent).forEach(field => {
            if (newStudent[field] && oldStudent[field] != newStudent[field]) {
                oldStudent[field] = newStudent[field];
            }
        });
        fs.writeFile(FILE_PATH, JSON.stringify(students, null, '  '), () => {});
        res.json(oldStudent);
    } else {
        res.statusCode = 401;
        res.json({error: 'No such student with provided id was found'});
    }
});

app.delete('/:n', (req, res) => {
    let student = students.find(s => s.id == req.params.n);
    if (student) {
        students.splice(students.findIndex(s => s.id == req.params.n), 1);
        fs.writeFile(FILE_PATH, JSON.stringify(students, null, '  '), () => {});
        res.json(student);
    } else {
        res.statusCode = 404;
        res.json({error: 'No such student with provided id was found'});
    }
});

app.post('/backup', (req, res) => {
    const date = new Date();
    let backupFile = BACKUP_DIR_PATH
        + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + '-'
        + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '-'
        + 'StudentList.json';
    setTimeout(() => {
        fs.copyFile(FILE_PATH, backupFile, e => {
            if (e) {
                res.statusCode = 500;
                res.json({error: e.message});
            }
            res.end();
        });
    }, 2000);
});

app.delete('/backup/:date', (req, res) =>
{
    fs.readdir(BACKUP_DIR_PATH, (e, files) =>
    {
        if (e)
        {
            res.statusCode = 500;
            res.json({error: e.message});
            throw e;
        }
        let backupDate = req.params.date;
        let year = '', month = '', day = '';
        for (let i = 0; i < backupDate.length; i++)
        {
            if (i < 4)
            {
                year += backupDate.charAt(i);
            }
            else if (i < 6)
            {
                day += backupDate.charAt(i);
            }
            else
            {
                month += backupDate.charAt(i);
            }
        }
        backupDate = new Date(Number(year), Number(month), Number(day));
        console.log(backupDate);
        files.forEach(file =>
        {
            let parms = file.split('-').splice(0, 6);
            let fileDate = new Date(
                Number(parms[0]),
                Number(parms[1]),
                Number(parms[2]),
                Number(parms[3]),
                Number(parms[4]),
                Number(parms[5])
            );
            if (backupDate > fileDate)
            {
                fs.unlink(BACKUP_DIR_PATH + file, e =>
                {
                    if (e)
                    {
                        res.statusCode = 500;
                        res.body = JSON.stringify({error: e.message});
                        throw e;
                    }
                })
            }
        });
        res.end();
    });
});

try
{
    fs.watch(BACKUP_DIR_PATH, (event, f) =>
    {
        if (f)
        {
            server.emit('Changed!', f, event);
        }
    });
}
catch (e)
{
    console.log('catch e = ', e.code);
}

app.listen({port:5000, host:'localhost'}, ()=>{
    console.log('Server running at http://localhost:5000/');
})