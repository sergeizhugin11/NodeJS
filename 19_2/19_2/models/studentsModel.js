var Students = [{id: 1, firstName: 'Zhuhin', lastName: 'Siarhei', group: 4, course: 3}];

module.exports = {
    getStudents: function()
    {
        return Students;
    },

    createStudent: function({firstName, lastName, group, course})
    {
        const id = Students.length + 1;
        const newStudent = {id, firstName, lastName, group, course};
        Students.push(newStudent);
        return newStudent;
    },

    deleteStudent: function (ID) {
        let iterator = [];
        for (let item of Students)
        {
            if (item.id == ID)
            {
                continue;
            }
            iterator.push(item);
        }
        Students = iterator;
    }
};
