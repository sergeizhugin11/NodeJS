const rpcWSS = require('rpc-websockets').Client;

const ws = new rpcWSS('ws://localhost:4000');
ws.on('open', () => {
    ws.login({login:'qwe', password:'qwe'})
        .then(async (login)=>{
            if(login) {
                    ws.call('sum', [
                        ws.call('square', [3]),
                        ws.call('square', [5, 4]),
                        ws.call('mul', [3, 5, 7, 9, 11, 13])])
                    + ws.call('fibn', [7])
                    * ws.call('mul', [2, 4, 6]).then(r=>{
                        console.log(r)});

            }else console.log('error');});
            });
ws.on('error', (e)=>{console.log('error = ', e)});