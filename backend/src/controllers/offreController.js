const { Offre } = require('../Models')
const { notificationController } = require('./notificationController')
const { ValidationError } = require('sequelize')

class OffreController{

     // Méthode pour créer une nouvelle offre de stage
    static async createOffre(req, res) {
        Offre.create(req.body)
            .then(offre => {
                // Création d'une notification associée à la création de l'offre
                notificationController.createNotification({
                    id_utilisateur: null,
                    message : `Une nouvelle offre de stage a été publiée : ${offre.intitule}. N'hésitez pas à postuler si elle convient à votre profil !`,
                    type : 'actualité',
                    date_reception : new Date()
                })
                .then(_ => {
                    const message = `L'offre a été créée avec succès.`;
                    res.status(201).json({ message, data: offre });
                })
                .catch(error => {
                    throw error;
                })
            })
            .catch(error => {
                // Gestion des erreurs de validation
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `L'offre n'a pas pu être créée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour supprimer une offre de stage
    static async deleteOffre(req, res) {
        const id = req.params.id;
        Offre.destroy({ where: { id: id } })
            .then(deleted => {
                if (deleted) {
                    const message = `L'offre avec l'identifiant ${id} a été supprimée avec succès.`;
                    res.json({ message });
                } else {
                    const message = `L'offre avec l'identifiant ${id} n'existe pas.`;
                    res.status(404).json({ message });
                }
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `L'offre avec l'identifiant ${id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour récupérer toutes les offres de stage
    static async getAllOffres(req, res) {
        Offre.findAll()
            .then(offres => {
                const message = `La liste des offres a été récupérée avec succès.`;
                res.json({ message, data: offres });
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `La liste des offres n'a pas pu être récupérée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour mettre à jour une offre de stage
    static async updateOffre(req, res) {
        const id = req.params.id;
        Offre.update(req.body, { where: { id: id }, returning: true, plain: true })
            .then(result => {
                if (result[0] === 1) {
                    const message = `L'offre avec l'identifiant ${id} a été mise à jour avec succès.`;
                    res.json({ message, data: result[1] });
                } else {
                    const message = `L'offre avec l'identifiant ${id} n'existe pas.`;
                    res.status(404).json({ message });
                }
            })
            .catch(error => {
                // Gestion des erreurs de validation
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `L'offre avec l'identifiant ${id} n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }
}
