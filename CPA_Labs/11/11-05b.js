const rpcWSS = require('rpc-websockets').Client;

const ws = new rpcWSS('ws://localhost:4000');
ws.on('open', async () => {
    ws.login({login:'qwer', password:'qwe'})
        .then(async (login)=>{
    if(login){
    await ws.call('square', [3]).then((r)=>{ console.log('square(3) = ', r);});
    await ws.call('square', [5,4]).then((r)=>{ console.log('square(5,4) = ', r);});
    await ws.call('sum', [2]).then((r)=>{ console.log('sum(2) = ', r);});
    await ws.call('sum', [2,4,6,8,10]).then((r)=>{ console.log('sum(2,4,6,8,10) = ', r);});
    await ws.call('mul', [3]).then((r)=>{ console.log('mul(3) = ', r);});
    await ws.call('mul', [3,5,7,9,11,13]).then((r)=>{ console.log('mul(3,5,7,9,11,13) = ', r);
            });
        }else console.log('error');
    })
});
ws.on('error', (e)=>{console.log('error = ', e)});