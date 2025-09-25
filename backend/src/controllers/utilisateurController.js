const { where, ValidationError, UniqueConstraintError } = require('sequelize');
const { Utilisateur } = require('../Models');
const bcrypt = require('bcrypt');

class UtilisateurController {

    // Méthode pour créer un nouvel utilisateur

    static async createUtilisateur(req, res) {
        // Hash du mot de passe avant de le stocker en base de données
        const {password}= req.body;
        passwordHash = bcrypt.hashSync(password, 10);
        Utilisateur.create({...req.body, password: passwordHash})
            .then(utilisateur => {
                const message = `L'utilisateur a été créé avec succès.`;
                res.json({ message, data: utilisateur });
            })
            .catch(error => {
                // Gestion des erreurs de validation et de contrainte d'unicité
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })

    }

    //Méthode pour modifier un utilisateur

    static async updateUtilisateur(req, res) {
        const id = parseInt(req.params.id)
        Utilisateur.update(req.body,{
            where: { id: id }
        })
            .then(_ => {
                return Utilisateur.findByPk(id).then(utilisateur => {
                    // Si l'utilisateur n'existe pas, on renvoie une erreur 404
                    if(utilisateur === null) {
                        const message = `L'utilisateur demandé n'existe pas.`;
                        return res.status(404).json({ message });
                    }
                    const message = `L'utilisateur ${utilisateur.prenom} ${utilisateur.nom} a bien été modifié.`;
                    res.json({ message, data: utilisateur });
                })
            })
            .catch(error => {
                // Gestion des erreurs de validation et de contrainte d'unicité
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    //Méthode pour supprimer un utilisateur

    static async deleteUtilisateur(req, res) {
        const id = parseInt(req.params.id);
        Utilisateur.findByPk(id)
            .then(utilisateur => {

                // Si l'utilisateur n'existe pas, on renvoie une erreur 404
                if(utilisateur === null) {
                    const message = `L'utilisateur demandé n'existe pas.`;
                    return res.status(404).json({ message });
                }

                const utilisateurDeleted = utilisateur;
                return Utilisateur.destroy({ where: { id } })
                    .then(() => {
                        const message = `L'utilisateur ${utilisateurDeleted.prenom} ${utilisateurDeleted.nom} a bien été supprimé.`;
                        res.json({ message, data: utilisateurDeleted });
                    })
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `L'utilisateur n'a pas pu être supprimé. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }
}

module.exports = UtilisateurController;