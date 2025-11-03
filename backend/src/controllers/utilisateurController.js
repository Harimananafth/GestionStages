const { ValidationError, UniqueConstraintError, Sequelize } = require('sequelize');
const { Utilisateur } = require('../Models');
const bcrypt = require('bcrypt');

class UtilisateurController {

    // Méthode pour créer un nouvel utilisateur
    static async createUtilisateur(req, res) {
        try {
            const utilisateur = await Utilisateur.sequelize.transaction(async (t) => {
                const { password, ...reste } = req.body;
                const passwordHash = bcrypt.hashSync(password, 10);

                return await Utilisateur.create(
                    { ...reste, password: passwordHash },
                    { transaction: t }
                );
            });

            const message = `L'utilisateur a été créé avec succès.`;
            res.json({ message, data: utilisateur });

        } catch (error) {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }

            const message = `L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier un utilisateur
    static async updateUtilisateur(req, res) {
        const id = parseInt(req.params.id);

        try {
            const utilisateur = await Utilisateur.sequelize.transaction(async (t) => {
                const utilisateur = await Utilisateur.findByPk(id, { transaction: t });

                if (!utilisateur) {
                    throw new Error('not_found');
                }

                const { password, ...reste } = req.body;
                let updatedFields = { ...reste };
                if (password && !bcrypt.compareSync(password, utilisateur.password)) {
                    updatedFields.password = bcrypt.hashSync(password, 10);
                }

                await utilisateur.update(updatedFields, { transaction: t });
                return utilisateur;
            });

            const message = `L'utilisateur ${utilisateur.email} a bien été modifié.`;
            res.json({ message, data: utilisateur });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `L'utilisateur demandé n'existe pas.` });
            }
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }

            const message = `L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer un utilisateur
    static async deleteUtilisateur(req, res) {
        const id = parseInt(req.params.id);

        try {
            const utilisateur = await Utilisateur.sequelize.transaction(async (t) => {
                const utilisateur = await Utilisateur.findByPk(id, { transaction: t });

                if (!utilisateur) {
                    throw new Error('not_found');
                }

                await Utilisateur.destroy({ where: { id }, transaction: t });
                return utilisateur;
            });

            const message = `L'utilisateur ${utilisateur.email} a bien été supprimé.`;
            res.json({ message, data: utilisateur });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `L'utilisateur demandé n'existe pas.` });
            }

            const message = `L'utilisateur n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }


    static async updateByEmail(email, fields) {
        const utilisateur = await Utilisateur.findOne({ where: { email } });
        if (!utilisateur) throw new Error('not_found');

        if (fields.password && !bcrypt.compareSync(fields.password, utilisateur.password)) {
            fields.password = bcrypt.hashSync(fields.password, 10);
        }

        await utilisateur.update(fields);
        return utilisateur;
    }

}

module.exports = UtilisateurController;
