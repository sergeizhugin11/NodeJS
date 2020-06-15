const express = require('express');
const fs = require('fs');
const cp = require('cookie-parser');
var db = require('./db');
const session = require('express-session')({ resave: false, saveUnitialized: false, secret: '12345678' });

const formsRouter = express.Router();

formsRouter.use(cp());
formsRouter.use(express.urlencoded({ extended: true}));
formsRouter.use(session);

formsRouter.get('/login', (req, res, next) => {
    const rs = fs.ReadStream('./21-06.html');
    res.type('html');
    rs.pipe(res);
}).post('/login',
    (req, res) => {
        console.log(req.body);
        if (db.users.findByUsername(req.body.username, function (err, user) {
            if (err) { res.send("Poka 1!"); return false; }
            if (!user) { res.send("Poka 2!"); return false; }
            if (user.password != req.body.password) { res.send("Poka 3!"); return false; }
            return user;
        })) {
            res.cookie('tokken', req.body.username + '_token').redirect('/forms/resource');
        }
    }
).get('/resource',
    (req, res) => {
        if (req.cookies && req.cookies.tokken) {
            res.send("Top secret!!!");
        }
        else {
            res.redirect('/forms/login');
        }
    }
).get('/logout',
    (req, res) => { res.cookie('tokken', ''); res.redirect('/forms/login'); }
);

module.exports = formsRouter;