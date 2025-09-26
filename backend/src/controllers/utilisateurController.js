const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Utilisateur } = require('../Models');
const bcrypt = require('bcrypt');

class UtilisateurController {

    // Méthode pour créer un nouvel utilisateur
    static async createUtilisateur(req, res) {
        try {
            const { password, ...reste } = req.body;

            // Hash du mot de passe avant de le stocker
            const passwordHash = bcrypt.hashSync(password, 10);

            const utilisateur = await Utilisateur.create({ ...reste, password: passwordHash });

            const message = `L'utilisateur a été créé avec succès.`;
            res.json({ message, data: utilisateur });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier un utilisateur
    static async updateUtilisateur(req, res) {
        const id = parseInt(req.params.id, 10);

        try {
            const [affectedRows] = await Utilisateur.update(req.body, { where: { id } });

            if (!affectedRows) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ message });
            }

            const utilisateur = await Utilisateur.findByPk(id);

            const message = `L'utilisateur ${utilisateur.prenom} ${utilisateur.nom} a bien été modifié.`;
            res.json({ message, data: utilisateur });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer un utilisateur
    static async deleteUtilisateur(req, res) {
        const id = parseInt(req.params.id, 10);

        try {
            const utilisateur = await Utilisateur.findByPk(id);

            if (!utilisateur) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ message });
            }

            await Utilisateur.destroy({ where: { id } });

            const message = `L'utilisateur ${utilisateur.prenom} ${utilisateur.nom} a bien été supprimé.`;
            res.json({ message, data: utilisateur });

        } catch (error) {
            const message = `L'utilisateur n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }
}

module.exports = UtilisateurController;
