const { UtilisateurRole, Utilisateur, Role } = require('../Models');
const { where } = require('sequelize');


class UtilisateurRoleController {

    // Méthode pour attribuer un rôle à un utilisateur
    static async assignRoleToUser(req, res) {
        UtilisateurRole.create(req.body)
            .then(utilisateurRole => {
                const message = `Le rôle a été attribué à l'utilisateur avec succès.`;
                res.json({ message, data: utilisateurRole });
            })
            .catch(error => {
                const message = `Le rôle n'a pas pu être attribué à l'utilisateur. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    }

    // Méthode pour retirer un rôle d'un utilisateur
    static async removeRoleFromUser(req, res) {
        const { utilisateurId, roleId } = req.params;
        UtilisateurRole.destroy({
            where: {
                utilisateurId: utilisateurId,
                roleId: roleId
            }
        })
            .then(deletedCount => {
                // Si supprimé 0, le rôle n'existait pas pour cet utilisateur
                if (deletedCount === 0) {
                    const message = `Aucun rôle trouvé pour l'utilisateur spécifié.`;
                    return res.status(404).json({ message });
                }
                const message = `Le rôle a été retiré de l'utilisateur avec succès.`;
                res.json({ message });
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `Le rôle n'a pas pu être retiré de l'utilisateur. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    }
}
