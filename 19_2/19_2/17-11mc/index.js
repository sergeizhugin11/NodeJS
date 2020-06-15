const Students = require('./../models/studentsModel.js');

exports.getStudents = (req, res) => {
    const students = Students.getStudents();
    res.send(students);
};
exports.newStudent = (req, res) => {
    if (req.method === 'GET') {
        res.sendFile('newStudent.html', { root: './views' });
    }
    else if (req.method === 'POST') {
        console.log(req.body);
        const { firstName, lastName, group, course } = req.body;
        const user = Students.createStudent({ firstName, lastName, group, course });
        const students = Students.getStudents();
        res.send(students);
    }
};
exports.delStudent = (req, res) => {
    console.log(req.query);
    console.log(req.method);
    if (req.method === 'GET') {
        res.sendFile('deleteStudent.html', { root: './views' });
    }
    else if (req.method === 'DELETE') {
        console.log(req.query);
        const user = Students.deleteStudent(req.query.studentId);
        const students = Students.getStudents();
        res.send(students);
    }
};

exports.calc_salary = (req, res) => {
    console.log('calc/salary');
    res.send('calc/salary, method: ' + req.method);
};
exports.calc_trans = (req, res) => {
    console.log('calc/trans');
    res.send('calc/trans, method: ' + req.method);
};