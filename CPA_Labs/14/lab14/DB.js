const sql = require('mssql/msnodesqlv8');
//let dbreq01 = (parm)=>{new sql.Request().query(`select * from {parm}`,processing_result)};
let config = {
    driver: 'msnodesqlv8',
    connectionString:'Driver={SQL Server Native Client 11.0};Server={DESKTOP-BVQAVK6};Database={node14};Trusted_Connection={yes};'
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

    insert(rows, table) {
        return connector.then(pool => {
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
module.exports.db = new db();

