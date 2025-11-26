const multer = require("multer");
const path = require("path");

// Le stockage temporaire dans le dossier 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtre pour n'accepter que les types de fichiers pertinents (PDF, images)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    // Renvoyer une erreur si le format n'est pas bon
    cb(
      new Error(
        "Format de fichier non supporté. Veuillez utiliser PDF, PNG ou JPG."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB max par fichier
  fileFilter: fileFilter,
});

// Exportation de la méthode qui gère plusieurs fichiers nommés
module.exports = upload.fields([
  { name: "cv", maxCount: 1 }, 
  { name: "lm", maxCount: 1 }, 
]);
