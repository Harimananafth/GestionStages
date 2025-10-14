const express = require('express');
const fs = require("fs");
const path = require("path");
const db = require('./Models');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { Utilisateur } = require("./Models");
const authMiddleware = require("./middlewares/authMiddleware");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: process.env.FRONTEND_URL || function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


const imagesPath = path.join(__dirname, '../frontend/public/images');
app.use('/images', express.static(imagesPath));

app.get('/', (req, res) => {
  res.json({ message: "Hello from Gestion Stage API REST !" });
});


const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith(".js")) {
    const routeModule = require(path.join(routesPath, file));
    if (routeModule.router && routeModule.prefix) {
      app.use(`/api${routeModule.prefix}`, routeModule.router);
      console.log(`Route loaded: /api${routeModule.prefix}`);
    }
  }
});


app.get("/api/user/photo", authMiddleware, async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.id);
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    
    const photoPath = user.photo
      ? path.join(__dirname, '../frontend/public', user.photo)
      : path.join(__dirname, '../frontend/public/images/default-img-profil.png');

    
    if (!fs.existsSync(photoPath)) {
      return res.status(404).send("Photo non trouvée");
    }

    
    res.sendFile(photoPath);
  } catch (err) {
    console.error("Erreur lors de la récupération de la photo :", err);
    res.status(500).send("Erreur serveur");
  }
});


db.sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie !');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données :', err);
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
