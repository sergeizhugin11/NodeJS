const sql = require('mssql/msnodesqlv8');
const config = require('./../config').db;

let connectionPool;
class Db {
    constructor() {
        connectionPool = new sql.ConnectionPool(config).connect();
    }

    query(query) {
        return connectionPool
            .then(pool => pool.query(query))
            .then(response => {return response.recordset});
    }

    getAll(tableName) {
        return connectionPool
            .then(pool => pool.query(`SELECT * FROM ${tableName}`))
            .then(response => response.recordset);
    }

    getOne(tableName, fields) {
        return connectionPool.then(pool => {
            const request = pool.request();
            let command = `SELECT TOP(1) * FROM ${tableName} WHERE`;
            Object.keys(fields).forEach(field => {
                let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
                request.input(field, fieldType, fields[field]);
                command += ` ${field} = @${field} AND`;
            });
            command = command.slice(0, -3);
            return request.query(command);
        }).then(response => response.recordset);
    }

    insertOne(tableName, fields) {
        return connectionPool.then(pool => {
            const request = pool.request();
            let command = `INSERT INTO ${tableName} values (`;
            Object.keys(fields).forEach(field => {
                let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
                request.input(field, fieldType, fields[field]);
                command += `@${field},`;
            });
            command = command.replace(/.$/,")");
            return request.query(command);
        });
    }

    updateOne(tableName, fields) {
        return connectionPool.then(pool => {
            const IDField = tableName + '_ID';
            if (!fields[IDField] || !Number.isInteger(fields[IDField])) {
                throw 'There are no ID value has been provIDed. Example: {TableName}_ID';
            }
            const request = pool.request();
            let command = `UPDATE ${tableName} SET `;
            Object.keys(fields).forEach(field => {
                let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
                request.input(field, fieldType, fields[field]);
                if (!field.endsWith('ID')) {
                    command += `${field} = @${field},`;
                }
            });
            command = command.slice(0, -1);
            command += ` WHERE ${IDField} = @${IDField}`;
            return request.query(command);
        });
    }

    deleteOne(tableName, ID) {
        return connectionPool.then(pool => {
            if (!ID || !Number.isInteger(Number(ID))) {
                throw 'There are no ID value has been provIDed. Example: /api/instances/:ID';
            }
            return pool.query(`DELETE FROM ${tableName} WHERE ${tableName}_ID = ${ID}`);
        });
    }
}

module.exports = Db;
