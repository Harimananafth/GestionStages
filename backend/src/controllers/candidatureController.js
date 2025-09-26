const { Candidature, Offre, Utilisateur } = require('../Models');
const { ValidationError } = require('sequelize');
const notificationController = require('./notificationController');

class CandidatureController {

    // Méthode pour lister toutes les candidatures
    static async getAllcandidature(req, res) {
        try {
            const candidatures = await Candidature.findAll();
            const message = `La liste des candidatures a été récupérée avec succès.`;
            return res.json({ message, data: candidatures });
        } catch (error) {
            const message = `La liste des candidatures n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour ajouter une candidature
    static async createCandidature(req, res) {
        try {
            const candidature = await Candidature.create(req.body);

            // Récupération de l'offre liée
            const offre = await Offre.findOne({
                where: { id_offre: candidature.id_offre }
            });

            if (!offre) {
                return res.status(404).json({ message: "Offre introuvable." });
            }

            // Création d'une notification associée
            await notificationController.createNotification({
                id_utilisateur: null,
                message: `Une candidature a été postée pour l'offre ${offre.titre}`,
                type: 'simple',
                date_reception: new Date()
            });

            const message = `La candidature a été postée avec succès.`;
            res.status(201).json({ message, data: candidature });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }

            const message = `La candidature n'a pas pu être créée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier une candidature
    static async updateCandidature(req, res) {
        const id = parseInt(req.params.id);
        try {
            const [affectedRows] = await Candidature.update(req.body, { where: { id } });

            if (affectedRows === 0) {
                return res.status(404).json({ message: "Candidature introuvable." });
            }

            const candidature = await Candidature.findByPk(id);
            const message = `La candidature a été mise à jour avec succès.`;
            res.json({ message, data: candidature });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La candidature n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier uniquement le statut d'une candidature et créer une notification
    static async updateCandidatureStatus(req, res) {
        const id = parseInt(req.params.id);
        const { statut } = req.body;

        try {
            const candidature = await Candidature.findByPk(id);

            if (!candidature) {
                return res.status(404).json({ message: "Candidature introuvable." });
            }

            candidature.statut = statut;
            await candidature.save();

            const offre = await Offre.findOne({
                where: { id_offre: candidature.id_offre }
            });

            if (!offre) {
                return res.status(404).json({ message: "Offre introuvable." });
            }

            // Récupération de l'utilisateur lié
            const utilisateur = await Utilisateur.findByPk(candidature.id_utilisateur);

            if (utilisateur) {
                await notificationController.createNotification({
                    id_utilisateur: utilisateur.id,
                    message: `Le statut de votre candidature pour l'offre ${offre.titre} a été mis à jour : ${statut}`,
                    type: 'info',
                    date_reception: new Date()
                });
            }
            const message = `Le statut de la candidature a été mis à jour avec succès.`;
            res.json({ message, data: candidature });

        } catch (error) {
            const message = `Le statut de la candidature n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer une candidature
    static async deleteCandidature(req, res) {
        const id = parseInt(req.params.id);

        try {
            const candidature = await Candidature.findByPk(id);

            if (!candidature) {
                return res.status(404).json({ message: "Candidature introuvable." });
            }

            await Candidature.destroy({ where: { id } });

            const message = `La candidature a été supprimée avec succès.`;
            res.json({ message, data: candidature });

        } catch (error) {
            const message = `La candidature n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }
}

module.exports = CandidatureController;
