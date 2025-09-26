const { Periode } = require('../Models');
const { notificationController } = require('./notificationController');
const { ValidationError } = require('sequelize');

class PeriodeController {
    // Méthode pour créer une nouvelle période de stage 
    static async createPeriode(req, res) {
        try {
            const periode = await Periode.create(req.body);

            // Création d'une notification associée
            await notificationController.createNotification({
                id_utilisateur: null,
                message: `La période de stage ${periode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${periode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} est ouverte. Vous pouvez dès à présent postuler aux offres disponibles.`,
                type: 'actualité',
                date_reception: new Date()
            });

            const message = `La période a été créée avec succès.`;
            return res.status(201).json({ message, data: periode });
        } catch (error) {
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
        try {
            const id = parseInt(req.params.id);
            const periode = await Periode.findByPk(id);

            if (!periode) {
                const message = `La période demandée n'existe pas.`;
                return res.status(404).json({ message });
            }

            await Periode.destroy({ where: { id } });

            const message = `La période avec l'identifiant ${id} a été supprimée avec succès.`;
            return res.json({ message });
        } catch (error) {
            const message = `La période avec l'identifiant ${req.params.id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour mettre à jour une période de stage
    static async updatePeriode(req, res) {
        try {
            const id = parseInt(req.params.id);

            // On récupère l'ancienne période avant la mise à jour
            const oldPeriode = await Periode.findByPk(id);
            if (!oldPeriode) {
                const message = `La période avec l'identifiant ${id} n'existe pas.`;
                return res.status(404).json({ message });
            }

            // Mise à jour
            await Periode.update(req.body, { where: { id } });

            // Récupération de la nouvelle valeur
            const updatedPeriode = await Periode.findByPk(id);

            // Création d'une notification associée
            await notificationController.createNotification({
                id_utilisateur: null,
                message: `La période de stage a été modifiée : ${oldPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${oldPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} devient ${updatedPeriode.date_debut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} - ${updatedPeriode.date_fin.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}.`,
                type: 'actualité',
                date_reception: new Date()
            });

            const message = `La période avec l'identifiant ${id} a été mise à jour avec succès.`;
            return res.json({ message, data: updatedPeriode });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La période avec l'identifiant ${req.params.id} n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }
}

module.exports = PeriodeController;
