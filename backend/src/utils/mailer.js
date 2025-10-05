const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function sendMail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html
  });
}

module.exports = { sendMail };
