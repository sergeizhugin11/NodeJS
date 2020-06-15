const app = require('express')();
const express = require('express');
const myrouter = new (require('./17-11m').MVCRouter)(
    '/:controller/:action'
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const handlers = require('./17-11mc');
const mycontrollers = new (require('./17-11m')).MVControllers(
    {
        students: {
            getStudents: handlers.getStudents,
            newStudent: handlers.newStudent,
            delStudent: handlers.delStudent
        }
    }
);

const mvc = new (require('./17-11m')).MVC(myrouter, mycontrollers);
app.get(mvc.router.uri_templates, mvc.use);
app.post(mvc.router.uri_templates, mvc.use);
app.put(mvc.router.uri_templates, mvc.use);
app.delete(mvc.router.uri_templates, mvc.use);
var server = app.listen(3000);