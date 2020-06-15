const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const rs1 = fs.createReadStream('./keksikCopy.txt');

axios.get('http://localhost:3000/')
    .then(function (response) {
        console.log(response);
        let cv = new ClientVerify(response.data);
        cv.verify(rs1, (result) => { console.log(result) });
    });

function ClientVerify(SignContext) {
    const v = crypto.createVerify('SHA256');
    this.verify = (rs, cb) => {
        rs.pipe(v);
        rs.on('end', () => { cb(v.verify(SignContext.publicKey, SignContext.signature, 'hex'))});
    }
}