const { Profil, sequelize } = require('../Models');
const { ValidationError } = require('sequelize');

class ProfilController {

    // Méthode pour lister tous les profils
    static async getAllProfil(req, res) {
        try {
            const profils = await Profil.findAll();
            const message = `La liste des profils a été récupérée avec succès.`;
            return res.json({ message, data: profils });
        } catch (error) {
            const message = `La liste des profils n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour ajouter un profil
    static async createProfil(req, res) {
        try {
            const profil = await sequelize.transaction(async (t) => {
                return await Profil.create(req.body, { transaction: t });
            });

            const message = `Le profil a été créé avec succès.`;
            res.status(201).json({ message, data: profil });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `Le profil n'a pas pu être créé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier un profil
    static async updateProfil(req, res) {
        const id = parseInt(req.params.id);
        try {
            const updatedProfil = await sequelize.transaction(async (t) => {
                const [affectedRows] = await Profil.update(req.body, { where: { id }, transaction: t });
                if (affectedRows === 0) throw new Error('not_found');
                return await Profil.findByPk(id, { transaction: t });
            });

            const message = `Le profil a été mis à jour avec succès.`;
            res.json({ message, data: updatedProfil });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: "Profil introuvable." });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `Le profil n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer un profil
    static async deleteProfil(req, res) {
        const id = parseInt(req.params.id);
        try {
            const deletedProfil = await sequelize.transaction(async (t) => {
                const profil = await Profil.findByPk(id, { transaction: t });
                if (!profil) throw new Error('not_found');
                await Profil.destroy({ where: { id }, transaction: t });
                return profil;
            });

            const message = `Le profil a été supprimé avec succès.`;
            res.json({ message, data: deletedProfil });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: "Profil introuvable." });
            }
            const message = `Le profil n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }
}

module.exports = ProfilController;
