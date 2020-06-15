const crypto = require('crypto');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var rs = fs.createReadStream('./keksik.txt');

app.get('/', function (req, res, next) {
    try {
        let ss = new ServerSign();
        ss.getSignContext(rs, (signcontext) => {
            console.log(signcontext);
            res.json(signcontext);
        })
    }
        catch (ex) {
        res.statusCode(409);
    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function ServerSign() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    })
    let s = crypto.createSign('SHA256');
    this.getSignContext = (rs, cb) => {
        rs.pipe(s);
        rs.on('end', () => {
            cb({
                signature: s.sign(privateKey).toString('hex'),
                publicKey: publicKey.toString('hex')
            })
        })
    }
}




























