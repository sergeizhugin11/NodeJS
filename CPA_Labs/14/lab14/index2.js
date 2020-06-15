const http = require('http');
const fs = require('fs');
const FILE_NAME = '/10.sql';
const sql = require('mssql/msnodesqlv8');
let config = {
    driver: 'msnodesqlv8',
    connectionString:'Driver={SQL Server Native Client 11.0};Server={DESKTOP-BK605PH\\SQLEXPRESS};Database={node14_1};Trusted_Connection={yes};'
};
let processing_result = (err,result) =>{
    if(err) console.log('error',err.code,err.originalError.info.message);
    else {
        for(let i = 0; i<result.rowsAffected[0];i++) {
            let str = '---';
            for (let key in result.recordset[i]) {
                str += ` ${key} = ${result.recordset[i][key]}`;
            }
        }
    }
};
let dbreq01 = (parm)=>{new sql.Request().query(`select * from faculty`,processing_result)};
let connector;
class db {
    constructor() {
        connector = new sql.ConnectionPool(config).connect();
        new sql.ConnectionPool(config).on('error',err=>{
            console.log(err.message);
        })
    }

    async select(table) {
        return await connector.then(pool => pool.query(`select * from ${table}`));
    }


    async insert(rows, table) {
        return await connector.then(pool => {
            const request = pool.request();
            let command = `INSERT INTO ${table} (`;
            Object.keys(rows).forEach(field=>{
                command +=field+',';
            });
            command = command.replace(/.$/,")");
            command+='values(';
            Object.keys(rows).forEach(field => {
                console.log(field);
                let fieldType = Number.isInteger(rows[field]) ? sql.Int : sql.NVarChar;
                request.input(field, fieldType, rows[field]);
                command += `@${field},`;
            });
            console.log(command);
            command = command.replace(/.$/,")");
            console.log(command);
            return request.query(command);
        });
    };
    updateOne(tableName, fields) {
        return connector.then(pool => {
            const idField = tableName;
            const request = pool.request();
            let command = `UPDATE ${tableName} SET `;
            Object.keys(fields).forEach(field => {
                let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
                request.input(field, fieldType, fields[field]);
                if (!field.endsWith('Id')) {
                    command += `${field} = @${field},`;
                }
            });
            command = command.slice(0, -1);
            command += ` WHERE ${idField} = @${idField}`;
            console.log(command);
            return request.query(command);
        });
    }
    delete(table,id) {
        return connector.then(pool => {
            console.log(`DELETE FROM ${table} WHERE ${table} = '${id}'`);
            return pool.query(`DELETE FROM ${table} WHERE ${table} = '${id}'`);
        });
    }
    async deleteTest(table,id) {
        let connect = await connector;
        return connect.query(`DELETE FROM ${table} WHERE ${table} = '${id}'`);
    }
}

let arr = {'faculty':'faculties','pulpit':'pulpits','subject':'subjects','auditoriumstypes':'auditorium_type', 'auditoriums':'auditorium'};
const bodyParser = require('body-parser');
let DB = new db();
const url = require('url');
http.createServer((req, res) => {
    if(req.method==='GET' && url.parse(req.url).pathname.split('/')[1]==='') {
        let html = fs.readFileSync(__dirname+'/index.html');
        res.end(html);
    } else
    if(req.method==='GET' && url.parse(req.url).pathname.split('/')[1]==='api') {
        if(Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2])!==undefined ) {
            DB.select(
                Object.keys(arr).find(key => arr[key] ===
                url.parse(req.url).pathname.split('/')[2])
            ).then(data => {
                let selectStr = JSON.stringify(data.recordset);
                res.setHeader('Content-Type', 'application/json');
                res.end(selectStr);
            }).catch(err => {
                console.log(err);
            });
        } else {
            res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
            res.end(
                JSON.stringify({
                'error': 1,
                'message':`table with name ${url.parse(req.url).pathname.split('/')[2]} not found`})
            );
        }
    } else
    if (req.method==='POST' && url.parse(req.url).pathname.split('/')[1]==='api') {
        if(Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2])!==undefined ) {
            req.on('data',(data)=>{
                DB.insert(
                    JSON.parse(data.toString()),
                    Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2])
                ).then((result)=>{
                    console.log(result);
                    res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
                    res.end(
                        JSON.stringify({
                            'message':`row inserted`,
                            'row':`${JSON.stringify(JSON.parse(data))}`
                        })
                    );
                }).catch(err=>{
                    console.log(err);
                    res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                    res.end(
                        JSON.stringify({
                            'error': 2,
                            'message':`check json object`,
                            'message db': `${err.message}`
                        })
                    );
                })
            });
        } else {
            res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
            res.end(
                JSON.stringify({
                    'error': 1,
                    'message':`table with name ${url.parse(req.url).pathname.split('/')[2]} not found`})
            );
        }
    } else
    if (req.method==='PUT' && url.parse(req.url).pathname.split('/')[1]==='api') {
        req.on('data',data=>{
            if(Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2])!==undefined ) {
                DB.updateOne(
                    Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2]),
                    JSON.parse(data.toString())
                ).then((result)=>{
                    console.log(result);
                    res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
                    res.end(
                        JSON.stringify({
                            'message':`row updated`,
                            'row':`${JSON.stringify(JSON.parse(data))}`
                        })
                    );
                }).catch(err=>{
                    console.log(err);
                    res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                    res.end(
                        JSON.stringify({
                            'error': 3,
                            'message':`check json object`,
                            'message db': `${err.message}`
                        })
                    );
                })
            } else {
                res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
                res.end(
                    JSON.stringify({
                        'error': 1,
                        'message':`table with name ${url.parse(req.url).pathname.split('/')[2]} not found`})
                );
            }
        });
    } else
    if (req.method==='DELETE' && url.parse(req.url).pathname.split('/')[1]==='api') {
        console.log(decodeURI( req.url.split('/')[3]));
        console.log(  Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2]))
        if(Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2])!==undefined ) {
            DB.delete(
                Object.keys(arr).find(key => arr[key] === url.parse(req.url).pathname.split('/')[2]),
                decodeURI( req.url.split('/')[3])
            ).then(data=>{
                res.writeHead(200, {"Content-Type": "application/json; charset=utf-8;"});
                res.end(
                    JSON.stringify({
                        'message':`row deleted`
                    })
                );
            }).catch(err=>{
                res.end(err.message);
            })
        } else {
            res.writeHead(404, {"Content-Type": "application/json; charset=utf-8;"});
            res.end(
                JSON.stringify({
                    'error': 1,
                    'message':`table with name ${url.parse(req.url).pathname.split('/')[2]} not found`})
            );
        }
    }
}).listen(5000,()=>{
    console.log('listening at http://localhost:5000/')
});

