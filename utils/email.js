const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alexedwards7453@gmail.com',
        pass: 'tester@123456'
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Notify App <notifyapp@codeclouds.in>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
