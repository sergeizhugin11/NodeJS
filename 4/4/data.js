var util = require('util');
var ee = require('events');

var db_data = [
    { id: '1', name: 'Petya', bday: '2001-01-01' },
    { id: '2', name: 'Vasua', bday: '2004-07-09' },
    { id: '3', name: 'Kolua', bday: '2010-11-02' }
];


var count = 0;
var comm = 0;

function DB() {
    this.get = () => { count++; return db_data; };
    this.post = (r) => { count++; db_data.push(r); };
    this.put = (r) => {
        count++;
        for (let i = 0; i < db_data.length; i++) {
            if (db_data[i].id === r.id) {
                db_data.splice(i, 1);
                break;
            } 
        }
    db_data.push(r);
    };
    this.delete = (r) => {
        count++;
        for (let i = 0; i < db_data.length; i++) {
            if (db_data[i].id === r.id) {
                db_data.splice(i, 1);
                break;
            }
        } 
    };
    this.commit = () => {
        comm++;
        console.log('commit');
    }
    this.getStatistics = (value) => {
        var stat = { start: value, finish: (new Date()).toJSON(), request: count, commit: comm };
        return stat;
    }
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;