const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Google App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Real Estate App',
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;