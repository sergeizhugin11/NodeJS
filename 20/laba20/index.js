const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cellPhonesRoute = require('./router');

const app = express();

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));

app.use('/', cellPhonesRoute);
app.listen(3000);
