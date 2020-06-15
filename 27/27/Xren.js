let TICK = 0;
let https = require('https');
let getoptions = (method) => {
    return {
        host: 'api.telegram.org',
        path: `/bot1199590734:AAGHAGEk3qfuStXxPgD5ixhM3ua6JxsxRsk/${method}`,
        port: 443,
        method: 'POST',
        headers: {'content-type':'application/json', 'accept':'application/json'}
    }
}

var oldMessages = new Set();
let reqX = (parms, resolve, reject) => {
    let rc = { next_parms: parms, tick: TICK, result: [] };
    let req = https.request(getoptions('getUpdates'), (res) => {
        let data = '';
        TICK++;
        res.on('data', (chunk) => { data += chunk.toString('utf8'); });
        res.on('end', () => {
            let teleg = JSON.parse(data);
            if (teleg && teleg.ok) {
                if (teleg.result.length > 0) {
                    rc.next_parms.offset = teleg.result[teleg.result.length - 1].update_id + 1;
                }
                rc.result = teleg.result;
                let newRes = [];
                for (let mes of rc.result) {
                    if (!oldMessages.has(mes.message.text)) {
                        oldMessages.add(mes.message.text);
                        newRes.push(mes);
                    }
                    
                }
                rc.result = newRes;
                console.log(rc.result, 'xzzzz');
                resolve(rc);
            }
            else {
                reject('error one');
            }
        });
        req.on('error', (e) => { console.log(e.message); reject('error 2'); })
    });
    //req.write(JSON.stringify(parms));
    req.end();
}

let tlgout = (p, pmsg, resolve, reject) => {
    if (p.result.length > 0) {
        p.result.map(el => {
            pmsg(el.message.text, TICK).then((text) => {
                let req = https.request(getoptions('sendMessage'), (res) => {
                    console.log(TICK, (new Date()).toString(), 'responce tick', p.next_parms, el.message.text);
                })
                req.on('error', (err) => { console.log('error 3', err); reject('error 3') })
                req.write(JSON.stringify({ chat_id: el.message.chat.id, parse_mode: 'HTML', text: text }))
                req.end();
            })
        })
        resolve('response')
    }
    else {
        console.log(TICK, (new Date()).toISOString());
        resolve('timeout tick')
    }
}

let TlgWait = (clock, pt) => {
    let t = pt || 5000;
    return new Promise((resolve, reject) => {
        setTimeout((c) => {
            resolve(parseInt(((new Date()).getTime() - c) / 1000).toFixed(0));
        }, t, clock);
    })
}

let TlgGet = (parms => {
    let rcc = new Promise((resolve, reject) => {
        reqX(parms, resolve, reject);
    });
    rcc.catch((err) => { return err; })
    return rcc;
})

let TlgOut = ((p, msg) => {
    let rcc = new Promise((resolve, reject) => {
        tlgout(p, msg, resolve, reject);
    });
    rcc.catch((err) => { return err; })
    return rcc;
})

let msg = async (txt, tick) => {
    return 'echo:' + txt;
}

(async (msg) => {
    let parms = { limit: 10, timeout: 60, offset: 0 };
    try {
        let clock = (new Date()).getTime();
        for (let i = 0; i < 1500; i++) {
            let rc1 = await TlgGet(parms);
            let rc2 = await TlgOut(rc1, msg);
            let rc3 = await TlgWait(clock, 5000);
        }
    }
    catch (err) { console.log(err); }
})(msg);