var nodemailer = require('nodemailer');
module.exports = (from, to, message) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sergei.zhugin11@gmail.com',
            pass: 'Iamafksorry3368'
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: 'Test nodemailer 06-02',
        html: `<p>${message}</p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log(info);
    }
    });
};