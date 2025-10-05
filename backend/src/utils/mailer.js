const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur (Gmail ici)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Fonction générique pour envoyer un mail
async function sendMail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: `"GestionStages" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
}

// Fonction spécifique pour envoyer un mail de vérification
async function sendVerificationMail(email, code) {
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #4A90E2;">Code de vérification</h2>
      <p>Bonjour,</p>
      <p>Votre code de vérification est :</p>
      <p style="font-size: 24px; font-weight: bold; color: #E94E77;">${code}</p>
      <p>Ce code est valide pendant <strong>5 minutes</strong>.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />
      <p style="font-size: 12px; color: #888;">Si vous n’avez pas demandé ce code, ignorez cet email.</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject: "Votre code de vérification",
    text: `Votre code de vérification est : ${code}`,
    html: htmlMessage
  });
}

module.exports = { sendVerificationMail };
