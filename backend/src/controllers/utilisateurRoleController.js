const { UtilisateurRole } = require('../Models');

class UtilisateurRoleController {

    // Méthode pour attribuer un rôle à un utilisateur
    static async assignRoleToUser(req, res) {
        try {
            const utilisateurRole = await UtilisateurRole.create(req.body);

            const message = `Le rôle a été attribué à l'utilisateur avec succès.`;
            res.json({ message, data: utilisateurRole });

        } catch (error) {
            const message = `Le rôle n'a pas pu être attribué à l'utilisateur. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour retirer un rôle d'un utilisateur
    static async removeRoleFromUser(req, res) {
        const { utilisateurId, roleId } = req.params;

        try {
            const deletedCount = await UtilisateurRole.destroy({
                where: { utilisateurId, roleId }
            });

            if (deletedCount === 0) {
                const message = `Aucun rôle trouvé pour l'utilisateur spécifié.`;
                return res.status(404).json({ message });
            }

            const message = `Le rôle a été retiré de l'utilisateur avec succès.`;
            res.json({ message });

        } catch (error) {
            const message = `Le rôle n'a pas pu être retiré de l'utilisateur. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }
}

module.exports = UtilisateurRoleController;
