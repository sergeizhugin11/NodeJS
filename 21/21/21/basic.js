const app = require('express')();
const passport = require('passport');
var db = require('./db');
const session = require('express-session')({ resave: false, saveUnitialized: false, secret: '12345678' });

var BasicStrategy = require('passport-http').BasicStrategy;

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new BasicStrategy(
    function (username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { console.log(password, user, '1'); return cb(null, false); }
            if (user.password != password) { console.log(password, user, '2'); return cb(null, false); }
            return cb(null, user);
        });
    }
));
app.get('/login', (req, res, next) => {
        if (req.session.logout && req.headers['authorization']) {
            req.session.logout = false;
            delete req.headers['authorization'];
        }
        next();
    }, passport.authenticate('basic', { session: true }), function (req, res) {
        res.redirect('/resource')
    }
).get('/resource',
    (req, res) => { if (req.headers['authorization']) { res.send('Top secret!!!') } else { res.send('Pysto') } }
).get('/logout',
    (req, res) => { req.session.logout = true; res.redirect('/login'); }
);

passport.serializeUser((user, done) => {
    console.log('serialize:displayName', user.username);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('deserialize:displayName', user.username);
    done(null, user);
});

app.listen(3000);