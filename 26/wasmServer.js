const express = require('express');
const fs = require('fs');

const app = express();

let wasmCode = fs.readFileSync('public/lib.wasm');

let wasmImports = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);

const {sum, mul, sub} = wasmInstance.exports;

app.get('/', (req, res) => {
    res.type('html').send(
        `sum(34, 47) = ${sum(34, 47)}<br/>
         mul(52, 19) = ${mul(52,19)}<br/>
         sub(777, 200) = ${sub(777,200)}<br/>`
    );
});

app.listen(3011, ()=> {
    console.log('Server is Running on port 3011');
} );