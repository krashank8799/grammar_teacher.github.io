const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "krashank.harfore@ssipmt.com",
        pass: "Ilmfvmaft@12345"
    }
});

module.exports =  {
  sendMailToUser: function sendMail(toMail,html, callback) {

let message = {
    from: "krashank.harfore@ssipmt.com",
    to: toMail,
    subject: "Digital Grammar Teacher",
    html: html
}
   transporter.sendMail(message, function(err, info) {
    if (err) {
        console.log('error',err);
        callback(false)
    } else {
        console.log("info",info);
        callback(true);
    }
  })
  }
}
