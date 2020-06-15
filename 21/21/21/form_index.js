const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const formsRouter = require('./form.js');

const app = express();
app.use(bodyParser.json());

app.use('/forms', formsRouter);

app.listen(3000);