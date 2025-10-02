const express = require('express')
const fs = require("fs")
const path = require("path")
const db = require('./Models')

const app = express();
const PORT = 5000;

app.use(express.json());

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


//Vérification connexion BD
db.sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie !');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);

});
