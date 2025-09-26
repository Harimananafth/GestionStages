const express = require('express');
const db = require('./Models')
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Hello from backend!" });
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
