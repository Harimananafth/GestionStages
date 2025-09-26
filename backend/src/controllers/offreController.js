const { Offre } = require('../Models')
const { notificationController } = require('./notificationController')
const { ValidationError } = require('sequelize')

class OffreController{

     // Méthode pour créer une nouvelle offre de stage
    static async createOffre(req, res) {
        try {
            const offre = await Offre.create(req.body);

            // Création d'une notification associée à l'offre
            await notificationController.createNotification({
                id_utilisateur: null,
                message: `Une nouvelle offre de stage a été publiée : ${offre.titre}. N'hésitez pas à postuler si elle convient à votre profil !`,
                type: 'actualité',
                date_reception: new Date()
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


    //Méthode pour supprimer une offre de stage
    static async deleteOffre(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Offre.destroy({ where: { id } });

            if (deleted) {
                const message = `L'offre avec l'identifiant ${id} a été supprimée avec succès.`;
                return res.json({ message });
            } else {
                const message = `L'offre avec l'identifiant ${id} n'existe pas.`;
                return res.status(404).json({ message });
            }
        } catch (error) {
            const message = `L'offre avec l'identifiant ${id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }


    //Méthode pour récupérer toutes les offres de stage
    static async getAllOffres(req, res) {
        try {
            const offres = await Offre.findAll();
            const message = `La liste des offres a été récupérée avec succès.`;
            return res.json({ message, data: offres });
        } catch (error) {
            const message = `La liste des offres n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }


    //Méthode pour mettre à jour une offre de stage
    static async updateOffre(req, res) {
        try {
            const id = req.params.id;
            const [updated] = await Offre.update(req.body, { where: { id } });

            if (updated) {
                const updatedOffre = await Offre.findByPk(id);
                const message = `L'offre avec l'identifiant ${id} a été mise à jour avec succès.`;
                return res.json({ message, data: updatedOffre });
            } else {
                const message = `L'offre avec l'identifiant ${id} n'existe pas.`;
                return res.status(404).json({ message });
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'offre avec l'identifiant ${id} n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

}

module.exports = OffreController
