const nodemailer = require('nodemailer');

module.exports = (message) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sergei.zhugin11@gmail.com',
            pass: 'Iamafksorry3368'
        }
    });

    const mailOptions = {
        from: 'sergei.zhugin11@gmail.com',
        to: 'sergei.zhugin111@gmail.com',
        subject: 'Module m0603',
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