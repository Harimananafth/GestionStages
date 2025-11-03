const express = require('express')
const fs = require("fs")
const path = require("path")
const db = require('./Models')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const {Utilisateur} = require("./Models");
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

app.get('/', (req, res) => {
  res.json({ message: "Hello from Gestion Stage API REST !" });
});

// Charger automatiquement toutes les routes
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
  const user = await Utilisateur.findByPk(req.user.id);
  if (!user.photo) return res.status(404).send("No photo");

  const response = await fetch(user.photo); 
  const buffer = await response.arrayBuffer();
  res.set("Content-Type", "image/jpeg"); 
  res.send(Buffer.from(buffer));
});


//Vérification connexion BD
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