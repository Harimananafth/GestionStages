const { Offre, Profil, Periode } = require('../Models');
const NotificationController = require('./notificationController');
const { ValidationError } = require('sequelize');

class OffreController {

    // Méthode pour créer une nouvelle offre de stage
    static async createOffre(req, res) {
        try {
            const offre = await Offre.sequelize.transaction(async (t) => {
                const newOffre = await Offre.create(req.body, { transaction: t });

                // Création d'une notification associée à l'offre
                await NotificationController.addNotification({
                    UtilisateurId: null,
                    message: `Une nouvelle offre de stage a été publiée : ${newOffre.titre}. N'hésitez pas à postuler si elle convient à votre profil !`,
                    type: 'actualité',
                    date_reception: new Date()
                });

                return newOffre;
            });

            const message = `L'offre a été créée avec succès.`;
            return res.status(201).json({ message, data: offre });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'offre n'a pas pu être créée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer une offre de stage
    static async deleteOffre(req, res) {
        const id = req.params.id;
        try {
            const deletedOffre = await Offre.sequelize.transaction(async (t) => {
                const offre = await Offre.findByPk(id, { transaction: t });
                if (!offre) throw new Error('not_found');
                await Offre.destroy({ where: { id }, transaction: t });
                return offre;
            });

            const message = `L'offre avec l'identifiant ${id} a été supprimée avec succès.`;
            return res.json({ message, data: deletedOffre });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `L'offre avec l'identifiant ${id} n'existe pas.` });
            }
            const message = `L'offre avec l'identifiant ${id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer toutes les offres de stage
    static async getAllOffres(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : null;

            const offres = await Offre.findAll({
            include: [
                {
                model: Profil,
                attributes: ['nomProfil'],
                through: { attributes: ['nbProfil'] }
                },
                {
                model: Periode,
                attributes: ['date_debut', 'date_fin']
                }
            ],
            order: [['date_publication', 'DESC']],
            ...(limit && { limit })
            });

            const message = 'La liste des offres a été récupérée avec succès.';
            return res.json({ message, data: offres });
        } catch (error) {
            const message = "La liste des offres n'a pas pu être récupérée. Réessayez dans quelques instants.";
            return res.status(500).json({ message, data: error });
        }
    }




    // Méthode pour mettre à jour une offre de stage
    static async updateOffre(req, res) {
        const id = req.params.id;
        try {
            const updatedOffre = await Offre.sequelize.transaction(async (t) => {
                const [updated] = await Offre.update(req.body, { where: { id }, transaction: t });
                if (!updated) throw new Error('not_found');
                return await Offre.findByPk(id, { transaction: t });
            });

            const message = `L'offre avec l'identifiant ${id} a été mise à jour avec succès.`;
            return res.json({ message, data: updatedOffre });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `L'offre avec l'identifiant ${id} n'existe pas.` });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'offre avec l'identifiant ${id} n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }
}

module.exports = OffreController;
