const { Notification } = require('../Models');
const { ValidationError } = require('sequelize');

class NotificationController {

    // Méthode pour créer une nouvelle notification
    static async createNotification(req, res) {
        try {
            const notification = await Notification.create(req.body);
            const message = `La notification a été créée avec succès.`;
            res.json({ message, data: notification });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La notification n'a pas pu être créée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer une notification
    static async deleteNotification(req, res) {
        const id = req.params.id;
        try {
            const deleted = await Notification.destroy({ where: { id: id } });
            if (deleted) {
                const message = `La notification avec l'identifiant ${id} a été supprimée avec succès.`;
                res.json({ message });
            } else {
                const message = `La notification avec l'identifiant ${id} n'existe pas.`;
                res.status(404).json({ message });
            }
        } catch (error) {
            const message = `La notification avec l'identifiant ${id} n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer toutes les notifications de type 'actualité'
    static async getRecentActualiteNotifications(req, res) {
        try {
            const notifications = await Notification.findAll({
                where: { type: 'actualité' },
                limit: 10,
                order: [['date_reception', 'DESC']]
            });
            const message = `La liste des actualités a été récupérée avec succès.`;
            res.json({ message, data: notifications });
        } catch (error) {
            const message = `La liste des notifications n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer toutes les notifications d'un utilisateur
    static async getUserNotifications(req, res) {
        const id_utilisateur = req.params.id_utilisateur;
        try {
            const notifications = await Notification.findAll({
                where: { id_utilisateur: id_utilisateur },
                order: [['date_reception', 'DESC']]
            });
            const message = `La liste des notifications a été récupérée avec succès.`;
            res.json({ message, data: notifications });
        } catch (error) {
            const message = `La liste des notifications n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }
}

module.exports = NotificationController;
