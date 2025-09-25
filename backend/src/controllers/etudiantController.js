const { Etudiant } = require('../Models')
const { ValidationError, where, Op } = require('sequelize')

class EtudiantController {

    // Méthode pour créer un nouvel étudiant
    static async createEtudiant(req, res) {
        Etudiant.create(req.body)
            .then(etudiant => {
                const message = `L'étudiant a été créé avec succès.`;
                res.json({ message, data: etudiant });
            })
            .catch(error => {
                // Gestion des erreurs de validation
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `L'étudiant n'a pas pu être créé. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    // Méthode pour récupérer tous les étudiants
    static async getAllEtudiants(req, res) {

        //Si on recherche un étudiant par son nom ou/et son prénom
        if(req.query.search){
            const search = req.query.search;
            if(search.length < 3){
                const message = `Le terme de recherche doit contenir au moins 3 caractères.`;
                return res.status(400).json({ message });
            }

            return Etudiant.findAndCountAll({
                where: {
                    [Op.or]: [
                        { nom: { [Op.like]: `%${search}%` } },
                        { prenom: { [Op.like]: `%${search}%` } }
                    ]
                }
            })
        }
        
        //Sinon on récupère tous les étudiants
        else{
            Etudiant.findAll()
            .then(etudiants => {
                const message = `La liste des étudiants a été récupérée avec succès.`;
                res.json({ message, data: etudiants });
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `La liste des étudiants n'a pas pu être récupérée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
        }
    }

    // Méthode pour supprimer un étudiant
    static async deleteEtudiant(req, res) {
        const id = req.params.id;
        Etudiant.destroy({ where: { id: id } })
            .then(deleted => {
                if (deleted) {
                    const message = `L'étudiant avec l'identifiant ${id} a été supprimé avec succès.`;
                    res.json({ message });
                }
                else {
                    const message = `L'étudiant avec l'identifiant ${id} n'existe pas.`;
                    res.status(404).json({ message });
                }
            })
            .catch(error => {
                // Gestion des erreurs
                const message = `L'étudiant avec l'identifiant ${id} n'a pas pu être supprimé. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }

    // Méthode pour mettre à jour un étudiant
    static async updateEtudiant(req, res) {
        const id = req.params.id;
        Etudiant.update(req.body, { where: { id: id } })
            .then(async ([affectedRows]) => {
                if (affectedRows) {
                    const etudiant = await Etudiant.findByPk(id);
                    const message = `L'étudiant avec l'identifiant ${id} a été mis à jour avec succès.`;
                    res.json({ message, data: etudiant });
                }
                else {
                    const message = `L'étudiant avec l'identifiant ${id} n'existe pas.`;
                    res.status(404).json({ message });
                }
            })
            .catch(error => {
                // Gestion des erreurs de validation
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                // Gestion des autres erreurs
                const message = `L'étudiant avec l'identifiant ${id} n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            })
    }


}

module.exports = EtudiantController;