const { Notification } = require('../Models');
const { ValidationError } = require('sequelize');

class NotificationController {

    // Méthode pour créer une nouvelle notification
    static async createNotification(req, res) {
        try {
            const notification = await Notification.sequelize.transaction(async (t) => {
                return await Notification.create(req.body, { transaction: t });
            });

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
            const deletedNotification = await Notification.sequelize.transaction(async (t) => {
                const notif = await Notification.findByPk(id, { transaction: t });
                if (!notif) throw new Error('not_found');
                await Notification.destroy({ where: { id }, transaction: t });
                return notif;
            });

            const message = `La notification avec l'identifiant ${id} a été supprimée avec succès.`;
            res.json({ message, data: deletedNotification });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `La notification avec l'identifiant ${id} n'existe pas.` });
            }
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
        const UtilisateurId = req.params.UtilisateurId;
        try {
            const notifications = await Notification.findAll({
                where: { UtilisateurId },
                order: [['date_reception', 'DESC']]
            });
            const message = `La liste des notifications a été récupérée avec succès.`;
            res.json({ message, data: notifications });
        } catch (error) {
            const message = `La liste des notifications n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour vérifier si un utilisateur a au moins une notification non lue
    static async avoirNotificationNonLu(req, res) {
        const UtilisateurId = req.params.UtilisateurId;
        try {
            const exists = await Notification.findOne({
                where: { UtilisateurId, lu: false }
            });
            res.json({ hasUnread: !!exists });
        } catch (error) {
            const message = `Impossible de vérifier les notifications non lues. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour mettre toutes les notifications d'un utilisateur en lu
    static async toutMarquerLu(req, res) {
        const UtilisateurId = req.params.UtilisateurId;
        try {
            const [updated] = await Notification.sequelize.transaction(async (t) => {
                return await Notification.update(
                    { lu: true },
                    { where: { UtilisateurId }, transaction: t }
                );
            });

            const message = `Toutes les notifications de l'utilisateur ${UtilisateurId} ont été marquées comme lues.`;
            res.json({ message, updated });
        } catch (error) {
            const message = `Impossible de mettre toutes les notifications en lu. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour mettre toutes les notifications d'admin en lu
    static async toutMarquerLuAdmin(req, res) {
        try {
            const [updated] = await Notification.sequelize.transaction(async (t) => {
                return await Notification.update(
                    { lu: true },
                    { where: { UtilisateurId: null, type: 'simple' }, transaction: t }
                );
            });

            const message = `Toutes les notifications simples ont été marquées comme lues.`;
            res.json({ message, updated });
        } catch (error) {
            const message = `Impossible de mettre toutes les notifications d'admin en lu. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer toutes les notifications d'admin
    static async getAdminNotifications(req, res) {
        try {
            const notifications = await Notification.findAll({
                where: { UtilisateurId: null, type: 'simple' },
                order: [['date_reception', 'DESC']]
            });
            const message = `La liste des notifications d'admin a été récupérée avec succès.`;
            res.json({ message, data: notifications });
        } catch (error) {
            const message = `La liste des notifications d'admin n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Service addNotification avec transaction
    static async addNotification(data) {
        return await Notification.sequelize.transaction(async (t) => {
            return await Notification.create(data, { transaction: t });
        });
    }

}

module.exports = NotificationController;
