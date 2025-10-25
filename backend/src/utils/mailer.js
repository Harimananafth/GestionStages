const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Fonction générique pour envoyer un mail
async function sendMail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: `"NeovateApp" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

// 1. Fonction spécifique pour envoyer un mail de vérification
async function sendVerificationMail(email, code) {
  const htmlMessage = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #4A90E2;">Code de vérification</h2>
            <p>Bonjour,</p>
            <p>Votre code de vérification est :</p>
            <p style="font-size: 24px; font-weight: bold; color: #E94E77;">${code}</p>
            <p>Ce code est valide pendant <strong>5 minutes</strong>.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />
            <p style="font-size: 12px; color: #888;">Si vous n’avez pas demandé ce code, ignorez cet email. <br/> Neovate Incorp. </p>
        </div>
    `;

  await sendMail({
    to: email,
    subject: "Votre code de vérification",
    text: `Votre code de vérification est : ${code}`,
    html: htmlMessage,
  });
}

// 2. Avertir l'admin d'un nouveau dépôt de candidature

async function sendAdminCandidatureNotification(
  adminEmail,
  etudiantNom,
  offreTitre
) {
  const subject = `Nouvelle Candidature Déposée : ${offreTitre}`;
  const htmlMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h2 style="color: #008080;">🔔 Nouveau Dépôt</h2>
            <p>Bonjour Admin,</p>
            <p>Une nouvelle candidature a été déposée pour l'offre :</p>
            <p style="font-size: 18px; font-weight: bold; color: #4A90E2;">${offreTitre}</p>
            <p>Par l'étudiant(e) : <strong>${etudiantNom}</strong>.</p>
            <p>Veuillez vous connecter à l'interface d'administration pour examiner le dossier.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />
            <p style="font-size: 12px; color: #888;">Ceci est une notification automatique.</p>
        </div>
    `;

  await sendMail({
    to: adminEmail,
    subject: subject,
    text: `Nouvelle candidature de ${etudiantNom} pour l'offre : ${offreTitre}.`,
    html: htmlMessage,
  });
}

// 3.Avertir l'étudiant du changement de statut de sa candidature

async function sendStudentStatusUpdate(
  studentEmail,
  offreTitre,
  nouveauStatut
) {
  let statusColor = "#4A90E2"; // Par défaut
  if (nouveauStatut === "Acceptée") statusColor = "#2ECC71"; // Vert
  else if (nouveauStatut === "Refusée") statusColor = "#E74C3C"; // Rouge

  const subject = `Mise à jour de votre candidature pour l'offre : ${offreTitre}`;
  const htmlMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h2 style="color: #4A90E2;">📝 Statut de Candidature Mis à Jour</h2>
            <p>Bonjour,</p>
            <p>Le statut de votre candidature pour l'offre <strong>"${offreTitre}"</strong> a été mis à jour.</p>
            <p>Nouveau Statut : <strong style="font-size: 20px; color: ${statusColor};">${nouveauStatut}</strong></p>
            ${
              nouveauStatut === "Acceptée"
                ? "<p>🎉 Félicitations ! Nous vous contacterons bientôt pour les prochaines étapes.</p>"
                : nouveauStatut === "Refusée"
                ? "<p>Nous vous remercions de votre intérêt et vous encourageons à postuler à d'autres offres.</p>"
                : ""
            }
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />
            <p style="font-size: 12px; color: #888;">Neovate Incorp. </p>
        </div>
    `;

  await sendMail({
    to: studentEmail,
    subject: subject,
    text: `Le statut de votre candidature pour l'offre ${offreTitre} est maintenant : ${nouveauStatut}.`,
    html: htmlMessage,
  });
}

module.exports = {
  sendVerificationMail,
  sendAdminCandidatureNotification,
  sendStudentStatusUpdate,
};
