// src/middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary.config");
const path = require("path");
const sanitize = (str) => str.replace(/[^\w.-]/g, "_");
// Configuration du stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "stages";
    if (file.fieldname === "photo") folder = "photos_profil";
    else if (file.fieldname === "cv") folder = "cv";
    else if (file.fieldname === "lettre") folder = "lettres";
    return {
      folder,
      resource_type: "auto",
      public_id: `${Date.now()}_${sanitize(file.originalname)}`,
    };
  },
});

// Configuration de Multer avec filtres et taille max
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Format non supporté"));
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;
