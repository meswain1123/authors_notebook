
var dotenv = require("dotenv");
dotenv.config({ silent: true });

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.GMAIL_APP_PASS
  }
});

function sendEmail(respond, to, subject, message) {
  var mailOptions = {
    from: process.env.FROM_EMAIL,
    to: to,
    subject: subject,
    // text: message,
    html: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      respond(error);
    } else {
      respond('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendEmail
};

// const mailjet = require('node-mailjet')
// .connect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_PRIVATE_KEY);

// function sendEmail(request, response) {
//   const i18n = require('../i18n/' + (request.body.locale || 'en'));
//   const send = mailjet.post('send');
//   const requestObject = { Messages:[{
//       From: {
//           Email: process.env.FROM_EMAIL,
//           Name: process.env.FROM_NAME
//       },
//       To: [{
//           Email: request.body.email
//       }],
//       Subject: i18n.passwordResetMailSubject,
//       HTMLPart: passwordResetTemplate(i18n)
//   }]};
//   send.request(requestObject).then(() => {
//     response.json({
//         success: true
//     });
//   }).catch((err) => {
//       console.log(err);

//       response.json({
//           error: err.statusCode
//       });
//   });
// }




// const request = mailjet
// .post("send", {'version': 'v3.1'})
// .request({
//   "Messages":[
//     {
//       "From": {
//         "Email": "meswain@gmail.com",
//         "Name": "Matthew"
//       },
//       "To": [
//         {
//           "Email": "meswain@gmail.com",
//           "Name": "Matthew"
//         }
//       ],
//       "Subject": "Greetings from Mailjet.",
//       "TextPart": "My first Mailjet email",
//       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
//       "CustomID": "AppGettingStartedTest"
//     }
//   ]
// });
// request
//   .then((result) => {
//     console.log(result.body)
//   })
//   .catch((err) => {
//     console.log(err.statusCode)
//   });
