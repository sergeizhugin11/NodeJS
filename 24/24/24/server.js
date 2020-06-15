const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const { createClient } = require('webdav');

const client = createClient('https://webdav.yandex.ru', { username: 'SilverHandOf', password: '' });
app.post('/md/:lamborgini', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            console.log(result);
            if (result) return res.sendStatus(408);
            else return res.json(client.createDirectory(req.params.lamborgini));
        })
});

app.post('/rd/:lamborgini', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            console.log(result);
            if (!result) return res.sendStatus(408);
            else return res.json(client.deleteFile(req.params.lamborgini));
        })
});

app.post('/up/:lamborgini', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            console.log(result);
            if (result) return res.sendStatus(408);
            else {
                let rs = fs.createReadStream('./gorod-3840x2160-noch-reka-18452.jpg');
                let ws = client.createWriteStream(req.params.lamborgini)
                return res.json(rs.pipe(ws));
            }
        })
});

app.post('/down/:lamborgini', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            console.log(result);
            if (!result) return res.sendStatus(404);
            else {
                return res.json(client.createReadStream(req.params.lamborgini).pipe(fs.createWriteStream('./Lamborgini.jpg')));
            }
        })
});

app.post('/del/:lamborgini', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            console.log(result);
            if (!result) return res.sendStatus(404);
            else {
                return res.json(client.deleteFile(req.params.lamborgini));
            }
        })
});

app.post('/copy/:lamborgini/:zaporozhets', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            if (!result) return res.sendStatus(404);
            else {
                return client.copyFile(req.params.lamborgini, req.params.zaporozhets).then((result2) => {
                    if (!result2) return res.sendStatus(408);
                    else {
                        return res.send("good");
                    }
                });
                     
            }
        })
});

app.post('/move/:lamborgini/:zaporozhets', function (req, res) {
    client.exists(req.params.lamborgini)
        .then((result) => {
            console.log(result);
            if (!result) return res.sendStatus(404);
            else {
                return client.moveFile(req.params.lamborgini, req.params.zaporozhets).then((result2) => {
                    if (!result2) return res.sendStatus(408);
                    else {
                        return res.send("good");
                    }
                });

            }
        })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});