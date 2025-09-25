const  { Periode } = require('../Models')
const { notificationController } = require('./notificationController')
const { ValidationError} = require('sequelize')


class PeriodeController {

    //Méthode pour créer une nouvelle période de stage 
    static async createPeriode(req, res) {
        Periode.create(req.body)
            .then(periode => {
                // Création d'une notification associée à la création de la période
                notificationController.createNotification({
                    id_utilisateur: null,
                    message : `La période de stage ${periode.date_debut.toLocaleString('fr-FR', { month : 'long', year : 'numeric' })} - ${periode.date_fin.toLocaleString('fr-FR', { month : 'long', year : 'numeric' })} est ouverte. Vous pouvez dès à présent postuler aux offres disponibles.`,
                    type : 'actualité',
                    date_reception : new Date()
                })
                .then(_ => {
                    const message = `La période a été créée avec succès.`;
                    res.status(201).json({ message, data: periode });
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
                const message = `La période n'a pas pu être créée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour récupérer toutes les périodes de stage
    static async getAllPeriodes(req, res) {
        Periode.findAll()
            .then(periodes => {
                const message = `La liste des périodes a été récupérée avec succès.`;
                res.json({ message, data: periodes });
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `La liste des périodes n'a pas pu être récupérée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour supprimer une période de stage
    static async deletePeriode(req, res) {
        const id = parseInt(req.params.id);
        Periode.findByPk(id)
            .then(periode => {
                // Si la période n'existe pas, on renvoie une erreur 404
                if(periode === null) {
                    const message = `La période demandée n'existe pas.`;
                    return res.status(404).json({ message });
                }
                return Periode.destroy({ where: { id: id } })
                    .then(_ => {
                        const message = `La période avec l'identifiant ${id} a été supprimée avec succès.`;
                        res.json({ message });
                    })
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `La période avec l'identifiant ${id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour mettre à jour une période de stage
    static async updatePeriode(req, res) {
        const id = parseInt(req.params.id);
        Periode.update(req.body, { where: { id: id } })
            .then(async ([affectedRows]) => {
                if (affectedRows) {
                    const oldPeriode = await Periode.findByPk(id);
                    const updatedPeriode = await Periode.findByPk(id);

                    await notificationController.createNotification({
                        id_utilisateur: null,
                        message: `La période de stage a été modifiée : ${oldPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${oldPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} devient ${updatedPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${updatedPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}.`,
                        type: 'actualité',
                        date_reception: new Date()
                    })
                    .then(_ => {
                        const message = `La période avec l'identifiant ${id} a été mise à jour avec succès.`;
                        res.json({ message, data: updatedPeriode });
                    })
                    .catch(error => {
                        throw error;
                    })
                }
                else {
                    const message = `La période avec l'identifiant ${id} n'existe pas.`;
                    res.status(404).json({ message });
                }
            })
            .catch(error => {
                // Gestion des erreurs de validation
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `La période avec l'identifiant ${id} n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }
}

module.exports = PeriodeController