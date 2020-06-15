const crypto = require('crypto');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
var serverDH;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', function (req, res, next) {
    try {
        serverDH = new ServerDH(256, 3);
        const serverContext = serverDH.getContext();
        res.json(serverContext);
        next();
    }
    catch (ex) {
        res.statusCode(409);
    }
})

app.post('/getServerSecret', function (req, res) {
    try {
        const serverSecret = serverDH.getSecret(JSON.parse(JSON.stringify(req.body)));
        let iv = crypto.randomBytes(16);

        fs.readFile('./server.txt', 'utf8', function (err, contents) {
            console.log(contents);
            let txt = contents;
            let cipher = crypto.createCipheriv('aes-256-cbc', serverSecret, iv);
            let stxt = cipher.update(txt);
            stxt = Buffer.concat([stxt, cipher.final()]);
            console.log(txt, '---->', stxt.toString('hex'));
            res.json({
                iv: iv.toString('hex'),
                stxt: stxt.toString('hex')
            });
        });
    }
    catch (ex) {
        res.statusCode(409);
    }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


function ServerDH(len_a, g) {
    const dh = crypto.createDiffieHellman(len_a, g);
    const p = dh.getPrime();
    const gb = dh.getGenerator();
    const k = dh.generateKeys();
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: gb.toString('hex'),
            key_hex: k.toString('hex')
        }
    }
    this.getSecret = (clientContext) => {
        const k = Buffer.from(clientContext.key_hex, 'hex');
        return dh.computeSecret(k);
    }
}

