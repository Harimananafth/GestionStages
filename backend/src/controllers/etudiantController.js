const { Etudiant } = require('../Models');
const { ValidationError, Op } = require('sequelize');

class EtudiantController {
    // Méthode pour créer un nouvel étudiant
    static async createEtudiant(req, res) {
        try {
            const etudiant = await Etudiant.create(req.body);
            const message = `L'étudiant a été créé avec succès.`;
            return res.status(201).json({ message, data: etudiant });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'étudiant n'a pas pu être créé. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer tous les étudiants (ou rechercher)
    static async getAllEtudiants(req, res) {
        try {
            if (req.query.search) {
                const search = req.query.search;
                if (search.length < 3) {
                    const message = `Le terme de recherche doit contenir au moins 3 caractères.`;
                    return res.status(400).json({ message });
                }

                const result = await Etudiant.findAndCountAll({
                    where: {
                        [Op.or]: [
                            { nom: { [Op.like]: `%${search}%` } },
                            { prenom: { [Op.like]: `%${search}%` } }
                        ]
                    }
                });

                const message = `La recherche des étudiants a été effectuée avec succès.`;
                return res.json({ message, count: result.count, data: result.rows });
            }

            const etudiants = await Etudiant.findAll();
            const message = `La liste des étudiants a été récupérée avec succès.`;
            return res.json({ message, data: etudiants });
        } catch (error) {
            const message = `La liste des étudiants n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer un étudiant
    static async deleteEtudiant(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Etudiant.destroy({ where: { id } });

            if (deleted) {
                const message = `L'étudiant avec l'identifiant ${id} a été supprimé avec succès.`;
                return res.json({ message });
            } else {
                const message = `L'étudiant avec l'identifiant ${id} n'existe pas.`;
                return res.status(404).json({ message });
            }
        } catch (error) {
            const message = `L'étudiant avec l'identifiant ${req.params.id} n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour mettre à jour un étudiant
    static async updateEtudiant(req, res) {
        try {
            const id = req.params.id;
            const [affectedRows] = await Etudiant.update(req.body, { where: { id } });

            if (affectedRows) {
                const etudiant = await Etudiant.findByPk(id);
                const message = `L'étudiant avec l'identifiant ${id} a été mis à jour avec succès.`;
                return res.json({ message, data: etudiant });
            } else {
                const message = `L'étudiant avec l'identifiant ${id} n'existe pas.`;
                return res.status(404).json({ message });
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'étudiant avec l'identifiant ${req.params.id} n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }
}

module.exports = EtudiantController;
