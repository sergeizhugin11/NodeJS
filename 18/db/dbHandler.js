const Sequelize = require('sequelize');

const sequelize = new Sequelize('node18S','Sergey','12345678',{host:'DESKTOP-BK605PH',dialect:'mssql',dialectOptions:{options:{encrypt:true}}});

const auditoriums = require('./models/auditorium')(Sequelize, sequelize);
const auditoriumTypes = require('./models/auditorium-type')(Sequelize, sequelize);

const faculties = require('./models/faculty')(Sequelize, sequelize);
const pulpits = require('./models/pulpit')(Sequelize, sequelize);
const subjects = require('./models/subject')(Sequelize, sequelize);
const teachers = require('./models/teacher')(Sequelize, sequelize);


auditoriums.belongsTo(auditoriumTypes, {foreignKey: 'auditorium_typename'});
pulpits.belongsTo(faculties, {foreignKey: 'faculty_name'});
subjects.belongsTo(pulpits, {foreignKey: 'pulpit_name'});
teachers.belongsTo(pulpits, {foreignKey: 'pulpit_name'});


module.exports = {
    Auditoriums: auditoriums,
    AuditoriumTypes: auditoriumTypes,

    Faculties: faculties,
    Pulpits: pulpits,
    Subjects: subjects,
    Teachers: teachers,

    Sequelize: Sequelize,
    sequelize: sequelize
};

sequelize.sync({force: true})
    .then(() => console.log('Db has been synchronizing successfully'))
    .then(() => {
        return Promise.all([
            auditoriumTypes.bulkCreate(require('./mock-data/auditorium-types')),
            faculties.bulkCreate(require('./mock-data/faculties'))
        ]).then(() => Promise.all([
            auditoriums.bulkCreate(require('./mock-data/auditoriums')),
            pulpits.bulkCreate(require('./mock-data/pulpits'))
        ])).then(() => Promise.all([
            teachers.bulkCreate(require('./mock-data/teachers')),
            subjects.bulkCreate(require('./mock-data/subjects'))
        ]));
    })
    .catch(err => console.log('Error while synchronizing: ' + err.toString()));
