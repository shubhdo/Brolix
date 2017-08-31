const mailer = require('nodemailer');
const user = require('./password');


module.exports = function (toMail, subject, html, text) {


    let smtpTransport = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: user.user.user,
            pass: user.user.pass
        },
        port: 587,
        host: 'smtp.gmail.com'

    });


    let mail = {
        from: "<do_not_reply@gmail.com>",
        to: toMail,
        subject: subject,
        text: text,
        html: html
    }

    smtpTransport.sendMail(mail, function (error, success) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(success);
        }
        return success.accepted;

    })

}