const sendmail = require('sendmail')({silent:true});
const from = 'no-reply@myapp.com';
const to = 'm.yuliyas.00@gmail.com';

module.exports = function (text) {
    sendmail({
        from: from,
        to: to,
        subject: 'test',
        html: text
    }, (err, reply) => {
        console.log(err && err.stack);
        console.dir(reply);
    });
}
