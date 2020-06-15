const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

axios.get('http://localhost:3000/')
    .then(function (response) {
        const clientDH = new ClientDH(response.data);
        const clientSecret = clientDH.getSecret(response.data);
        const clientContext = clientDH.getContext();
        axios.post('http://localhost:3000/getServerSecret', clientContext)
        .then(function (response) {
            iv = Buffer.from(response.data.iv, 'hex');
            stxt = Buffer.from(response.data.stxt, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', clientSecret, iv);
            let txt = decipher.update(stxt);
            txt = Buffer.concat([txt, decipher.final()]).toString();
            fs.writeFile('./client.txt', txt, function (err) {
                if (err) return console.log(err);
            });
            console.log(stxt.toString('hex'), '---->', txt);
        })
        .catch(function (error) {
            console.log(error);
        });
}).catch(function (error) {
    console.log(error);
})

function ClientDH(serverContext) {
    const ctx = {
        p_hex: serverContext.p_hex ? serverContext.p_hex : '1111',
        g_hex: serverContext.g_hex ? serverContext.g_hex : '1'
    }
    const p = Buffer.from(ctx.p_hex, 'hex');
    const g = Buffer.from(ctx.g_hex, 'hex');
    const dh = crypto.createDiffieHellman(p, g);
    const k = dh.generateKeys();
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: g.toString('hex'),
            key_hex: k.toString('hex')
        }
    }
    this.getSecret = (serverContextt) => {
        const k = Buffer.from(serverContextt.key_hex, 'hex');
        return dh.computeSecret(k);
    }
}