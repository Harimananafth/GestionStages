const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Accès refusé : token manquant." });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            roles: decoded.roles || []
        };

        next();
    } catch (err) {
        console.error("Erreur middleware auth:", err.message);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expirée, veuillez vous reconnecter." });
        }
        return res.status(401).json({ message: "Token invalide ou non autorisé." });
    }
};
