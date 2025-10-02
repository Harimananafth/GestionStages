const { UtilisateurRole, sequelize } = require('../Models');

class UtilisateurRoleController {

    // Méthode pour attribuer un rôle à un utilisateur
    static async assignRoleToUser(req, res) {
        const { id_utilisateur, id_role } = req.body;

        if (!id_utilisateur || !id_role) {
            return res.status(400).json({ message: "L'id_utilisateur et l'id_role sont obligatoires." });
        }

        try {
            const utilisateurRole = await sequelize.transaction(async (t) => {
                return await UtilisateurRole.create({
                    id_role,
                    id_utilisateur,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, { transaction: t });
            });

            res.json({
                message: `Le rôle a été attribué à l'utilisateur avec succès.`,
                data: utilisateurRole
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Le rôle n'a pas pu être attribué à l'utilisateur. Réessayez dans quelques instants.`,
                data: error
            });
        }
    }

    // Méthode pour retirer un rôle d'un utilisateur
    static async removeRoleFromUser(req, res) {
        const { id_utilisateur, id_role } = req.params;

        try {
            const deletedCount = await sequelize.transaction(async (t) => {
                return await UtilisateurRole.destroy({
                    where: { id_utilisateur, id_role },
                    transaction: t
                });
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
