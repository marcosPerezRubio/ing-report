const fs = require('fs');
const {EMAIL_FROM, EMAIL_PWD, EMAIL_TO} = require('../config')
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PWD
    }
});

function sendReport(name, path, amount) {

    const mailOptions = {
        to: EMAIL_TO,
        subject: 'ING Expenses report',
        text: `Current amount ${amount}`
    };

    mailOptions.attachments = [
        {
            filename: name,
            path: path
        },
    ]

    return transporter.sendMail(mailOptions);
}


async function sendReportAndRemoveFile(fileName, filePath, amount) {
    await sendReport(fileName, filePath, amount)
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            err ? reject(err) : resolve()
        })
    })
}

module.exports = {
    sendReportAndRemoveFile
}
