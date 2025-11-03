const { Periode } = require('../models');
const NotificationController = require('./notificationController');
const { ValidationError } = require('sequelize');

class PeriodeController {
    // Méthode pour créer une nouvelle période de stage
    static async createPeriode(req, res) {
        try {
            const periode = await Periode.sequelize.transaction(async (t) => {
                const newPeriode = await Periode.create(req.body, { transaction: t });

                // Création d'une notification associée
                await NotificationController.addNotification({
                    UtilisateurId: null,
                    message: `La période de stage ${newPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${newPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} est ouverte. Vous pouvez dès à présent postuler aux offres disponibles.`,
                    type: 'actualité'
                });

                return newPeriode;
            });

            const message = `La période a été créée avec succès.`;
            return res.status(201).json({ message, data: periode });

        } catch (error) {
            console.error(error);
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La période n'a pas pu être créée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer toutes les périodes de stage
    static async getAllPeriodes(req, res) {
        try {
            const periodes = await Periode.findAll();
            const message = `La liste des périodes a été récupérée avec succès.`;
            return res.json({ message, data: periodes });
        } catch (error) {
            const message = `La liste des périodes n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer une période de stage
    static async deletePeriode(req, res) {
        const id = parseInt(req.params.id);
        try {
            await Periode.sequelize.transaction(async (t) => {
                const periode = await Periode.findByPk(id, { transaction: t });
                if (!periode) throw new Error('not_found');

                await Periode.destroy({ where: { id }, transaction: t });
            });

            const message = `La période avec l'identifiant ${id} a été supprimée avec succès.`;
            return res.json({ message });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `La période demandée n'existe pas.` });
            }
            const message = `La période avec l'identifiant ${id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour mettre à jour une période de stage
    static async updatePeriode(req, res) {
        const id = parseInt(req.params.id);
        try {
            const updatedPeriode = await Periode.sequelize.transaction(async (t) => {
                const oldPeriode = await Periode.findByPk(id, { transaction: t });
                if (!oldPeriode) throw new Error('not_found');

                await Periode.update(req.body, { where: { id }, transaction: t });
                const newPeriode = await Periode.findByPk(id, { transaction: t });

                // Création d'une notification associée
                await NotificationController.addNotification({
                    UtilisateurId: null,
                    message: `La période de stage a été modifiée : ${oldPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${oldPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} devient ${newPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${newPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}.`,
                    type: 'actualité',
                    date_reception: new Date()
                });

                return newPeriode;
            });

            const message = `La période avec l'identifiant ${id} a été mise à jour avec succès.`;
            return res.json({ message, data: updatedPeriode });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `La période avec l'identifiant ${id} n'existe pas.` });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La période avec l'identifiant ${id} n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }
}

module.exports = PeriodeController;
