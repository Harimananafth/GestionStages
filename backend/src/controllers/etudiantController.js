const { Etudiant } = require('../Models');
const { ValidationError, Op } = require('sequelize');

class EtudiantController {
    // Méthode pour créer un nouvel étudiant
    static async createEtudiant(req, res) {
        try {
            const etudiant = await Etudiant.sequelize.transaction(async (t) => {
                return await Etudiant.create(req.body, { transaction: t });
            });

            const message = `L'étudiant a été créé avec succès.`;
            return res.status(201).json({ message, data: etudiant });
        } catch (error) {
            console.log(error)
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
                            { nom: { [Op.iLike]: `%${search}%` } },
                            { prenom: { [Op.iLike]: `%${search}%` } }
                        ]
                    }
                });

                const message = `La recherche a retourné ${result.count} correspondance(s).`;
                return res.json({ message, data: result.rows });
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
        const id = req.params.id;
        try {
            const deletedEtudiant = await Etudiant.sequelize.transaction(async (t) => {
                const etudiant = await Etudiant.findByPk(id, { transaction: t });
                if (!etudiant) throw new Error('not_found');
                await Etudiant.destroy({ where: { id }, transaction: t });
                return etudiant;
            });

            const message = `L'étudiant avec l'identifiant ${id} a été supprimé avec succès.`;
            return res.json({ message, data: deletedEtudiant });
        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `L'étudiant avec l'identifiant ${id} n'existe pas.` });
            }
            const message = `L'étudiant avec l'identifiant ${id} n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour mettre à jour un étudiant
    static async updateEtudiant(req, res) {
        const id = req.params.id;
        try {
            const etudiant = await Etudiant.sequelize.transaction(async (t) => {
                const [affectedRows] = await Etudiant.update(req.body, { where: { id }, transaction: t });
                if (!affectedRows) throw new Error('not_found');
                return await Etudiant.findByPk(id, { transaction: t });
            });

            const message = `L'étudiant avec l'identifiant ${id} a été mis à jour avec succès.`;
            return res.json({ message, data: etudiant });
        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: `L'étudiant avec l'identifiant ${id} n'existe pas.` });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'étudiant avec l'identifiant ${id} n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour récupérer un étudiant en particluier à partir de son iduser

    static async getEtudiantByUserId (req, res){
        const UtilisateurId = req.params.id
        try{

            const etudiant = await Etudiant.findOne({where : { UtilisateurId }})

            if (!etudiant) {
                return res.status(404).json({ message: "Aucun étudiant trouvé pour cet utilisateur." });
            }

            const message = `L'étudiant a été récupéré avec succès.`;
            return res.json({ message, data: etudiant });

        }catch(error){
            const message = `L'étudiant n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            console.log(error)
            return res.status(500).json({ message, data: error });
        }
    }
}

module.exports = EtudiantController;
