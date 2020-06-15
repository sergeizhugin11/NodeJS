const app = require('express')();
const passport = require('passport');
var db = require('./db');
const session = require('express-session')({ resave: false, saveUnitialized: false, secret: '12345678' });

var DigestStrategy = require('passport-http').DigestStrategy;


app.use(session);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new DigestStrategy({ qop: 'auth' },
    function (userA, cb) {
        db.users.findByUsername(userA, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            return cb(null, user.username, user.password);
        });
    },
    function (params, done) {
        done(null, true)
    }
));
app.get('/login', (req, res, next) => {
    if (req.session.logout && req.headers['authorization']) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
}, passport.authenticate('digest', { session: true }), function (req, res) {
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