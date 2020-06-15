const http = require('http');
const fs = require('fs');
const FILE_NAME = '/10.sql';
const sql = require('mssql/msnodesqlv8');
//let dbreq01 = (parm)=>{new sql.Request().query(`select * from {parm}`,processing_result)};
let config = {
    driver: 'msnodesqlv8',
    connectionString:'Driver={SQL Server Native Client 11.0};Server={DESKTOP-BK605PH};Database={node14_1};Trusted_Connection={yes};'
};
// sql.connect(config,err=>{
//     if(err) console.log(err.message);
//     else{
//         dbreq01();
//     }
// });
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

    i = 2;

    insert(rows, table) {
        return connector.then(pool => {
            console.log(rows);
            console.log(table);
            const request = pool.request();
            let command = `insert into ${table} values (`;
            Object.keys(rows).forEach(row => {
                let fieldType = sql.NVarChar;
                request.input(row, fieldType, rows[row]);
                command += `@${row},`;
            });
            command = command.replace(/.$/, ")");
            return request._query(command,function(err){
                if(err) console.log(err);
            });
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
            return request.query(command);
        });
    }
    delete(table,id) {
        return connector.then(pool => {
            return pool.query(`DELETE FROM ${table} WHERE ${table} = '${id}'`,err=>{
                if(err) {
                    console.log(err.message);
                }
            });
        });
    }
    async deleteTest(table,id) {
        let connect = await connector;
        return connect.query(`DELETE FROM ${table} WHERE ${table} = '${id}'`);
    }
}
let params1 = new Map([
    ['GET',['/api/faculty','/api/pulpit','/api/subject','/api/auditorium_type','/api/auditorium']],
    ['POST',['/api/faculty','/api/pulpit','/api/subject','/api/auditorium_type','/api/auditorium']],
    ['PUT',['/api/faculty','/api/pulpit','/api/subject','/api/auditorium_type','/api/auditorium']],
    ['DELETE',['/api/faculty','/api/pulpit','/api/subject','/api/auditorium_type','/api/auditorium']],
]);
const bodyParser = require('body-parser');
let DB = new db();
http.createServer((req, res) => {

    if(req.url==='/')
    {
        let html = fs.readFileSync('index.html','utf-8');
        res.end(html);
    }
    if(req.method==='DELETE'){
        console.log(req.url.split('/'));

        console.log(decodeURI( req.url.split('/')[3]));
        DB.delete(req.url.split('/')[2],decodeURI( req.url.split('/')[3])).then(data=>{
            res.end('deleted');
        }).catch(err=>{
            res.end(err);
        })
    }
    for(let [key,value] of params1.entries()) {
        for(let val of value) {
            if(val===req.url && key === req.method) {
                if(req.method==='GET') {
                    console.log(req.url.split('/'));
                    DB.select(req.url.split('/')[2]).then(data=>{
                        let str = JSON.stringify(data.recordset);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(str);
                    }).catch(err=>{
                        console.log(err);
                    })
                } else if(req.method==='POST'){
                    req.on('data',data=>{
                        DB.insert(JSON.parse(data.toString()) ,req.url.split('/')[2])
                        res.end('added');
                    });

                } else if(req.method==='PUT'){
                    req.on('data',data=>{
                        DB.updateOne(req.url.split('/')[2],JSON.parse(data.toString()) );
                        res.end('edited');
                    });
                }else if(req.method==='DELETE'){
                    console.log(req.url.split('/'));

                    console.log(decodeURI( req.url.split('/')[3]));
                    DB.delete(req.url.split('/')[2],decodeURI( req.url.split('/')[3])
                    ).then(data=>{
                        res.end('cant');
                    }).catch(err=>{
                        res.end(err);
                    })
                }
            }
        }

    }

}).listen(5000,()=>{
    console.log('listening at http://localhost:5000/')
});

