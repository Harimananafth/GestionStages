const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

module.exports = (req, res, next) => {
  try {
    // Récupérer le token soit dans l'entête, soit dans le cookie
    let token = null;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Token manquant." });
    }

    // Vérifier le token
    const decodedToken = jwt.verify(token, privateKey);

    if (!decodedToken?.userId) {
      return res.status(401).json({ message: "Token invalide." });
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: decodedToken.userId,
      role: decodedToken.role || "etudiant"
    };

    // Vérifier que le body ne triche pas avec un autre userId
    if (req.body?.userId && req.body.userId !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit : userId non valide." });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Utilisateur non autorisé",
      error: error.message
    });
  }
};
