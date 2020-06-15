var http = require("http");
var url = require('url');
var redis = require('redis');

var client = redis.createClient('redis://redis-18906.c228.us-central1-1.gce.cloud.redislabs.com:18906', { password: 'eBV8mMpv3RjduB0wFgGjFEOSV8TgpMUW' });

client.on('connect', () => {
    console.log("connection to 12464");
});
client.on('error', (err) => {
    console.log(err.message);
});

http.createServer(function (req, resp) {
    switch (url.parse(req.url).pathname) {
        case '/get':
            get(10000);
            break;
        case '/set':
            set(10000);
            break;
        case '/del':
            del(10000);
            break;
        case '/incr':
            incr(10000);
            break;
        case '/decr':
            decr(10000);
            break;
        case '/hget':
            hget(10000);
            break;
        case '/hset':
            hset(10000);
            break;
        case '/subscribe':                      
            subscribe(10);
            break;
        case '/publish':
            publish(10);
            break;
    }
}).listen(3000, () => {
    console.log('server running at http://localhost:3000/')
});

function set(n)
{
    var start, finish;
    start = new Date();
    console.log("set");
    for (let i = 0; i < n; i++)
    {
        client.set("n-" + i, "Hello from Redis!", function (err, resuls)
        {
            console.log("err: " + err + ', res: ' + resuls);
            if (i + 1 == n)
            { 
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");  
            }
        });
        
    }
}

function get(n)
{
    var start, finish;
    start = new Date();
    console.log("get");
    for (let i = 0; i < n; i++) {
        client.get("n-" + i, function (err, reply)
        {
            console.log("err: " + err + ', res: ' + reply);
            if (i + 1 == n) {
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
            }
        });
    }
}

function del(n)
{
    var start, finish;
    start = new Date();
    console.log("del");
    for (let i = 0; i < n; i++) {
        client.del("n-" + i, function (err, reply) {
            console.log("err: " + err + ', res: ' + reply);
            if (i + 1 == n) {
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
            }
        });
    }

}

function incr(n)
{
    var start, finish;
    start = new Date();
    console.log("incr");
    for (let i = 0; i < n; i++) {
        client.incr("incr", function (err, reply) {
            console.log("err: " + err + ', res: ' + reply);
            if (i + 1 == n) {
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
            }
        });
    }
}

function decr(n)
{
    var start, finish;
    start = new Date();
    console.log("decr");
    for (let i = 0; i < n; i++) {
        client.decr("decr", function (err, reply) {
            console.log("err: " + err + ', res: ' + reply);
            if (i + 1 == n) {
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
            }
        });
    }
}

function hget(n)
{
    var start, finish;
    start = new Date();
    console.log("hget");
    for (let i = 0; i < n; i++) {
        client.hget("faculty", "IT", function (err, reply) {
            console.log("err: " + err + ', res: ' + reply);
            if (i + 1 == n) {
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
            }
        });
    }
}

function hset(n)
{
    var start, finish;
    start = new Date();
    console.log("hset");
    for (let i = 0; i < n; i++) {
        client.hset("faculty", "IT", JSON.stringify({ faculty_name: 'Informat tech' }), function (err, reply) {
            console.log("err: " + err + ', res: ' + reply);
            if (i + 1 == n) {
                finish = new Date();
                console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
            }
        });
    }
}

function subscribe()
{
    console.log("subscribe");
    var sub_client = redis.createClient('redis://redis-18906.c228.us-central1-1.gce.cloud.redislabs.com:18906', { password: 'eBV8mMpv3RjduB0wFgGjFEOSV8TgpMUW' });

        sub_client.on("subscribe", function (channel, count) {
            console.log("channel: " + channel + ', count: ' + count);
        });
        sub_client.on("message", function (channel, message) {
            console.log("channel: " + channel + ', message: ' + message);
        });
        sub_client.subscribe('channel-01');
        setTimeout(() => { sub_client.unsubscribe(); sub_client.quit(); }, 60000);
    
}

function publish()
{
    console.log("publish");

    var pub_client = redis.createClient('redis://redis-18906.c228.us-central1-1.gce.cloud.redislabs.com:18906', { password: 'eBV8mMpv3RjduB0wFgGjFEOSV8TgpMUW' });

    pub_client.publish('channel-01', 'from pub_client message 1');
    pub_client.publish('"channel-01', 'from pub_client message 2');
}