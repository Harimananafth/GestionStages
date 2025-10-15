const { Candidature, Offre, Utilisateur, Etudiant, sequelize } = require('../Models');
const { ValidationError, where } = require('sequelize');
const notificationController = require('./notificationController');

class CandidatureController {

    // Méthode pour lister toutes les candidatures
    static async getAllcandidature(req, res) {
        try {
            const candidatures = await Candidature.findAll();
            const message = `La liste des candidatures a été récupérée avec succès.`;
            return res.json({ message, data: candidatures });
        } catch (error) {
            const message = `La liste des candidatures n'a pas pu être récupérée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour ajouter une candidature
    static async createCandidature(req, res) {
        try {
            const candidature = await sequelize.transaction(async (t) => {
                const newCandidature = await Candidature.create(req.body, { transaction: t });

                // Récupération de l'offre liée
                const offre = await Offre.findByPk(newCandidature.OffreId, { transaction: t });
                if (!offre) throw new Error('offre_not_found');

                // Création d'une notification associée
                await notificationController.addNotification({
                    UtilisateurId: null,
                    message: `Une candidature a été postée pour l'offre ${offre.titre}`,
                    type: 'simple',
                    date_reception: new Date()
                });

                return newCandidature;
            });

            const message = `La candidature a été postée avec succès.`;
            return res.status(201).json({ message, data: candidature });

        } catch (error) {
            if (error.message === 'offre_not_found') {
                return res.status(404).json({ message: "Offre introuvable." });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La candidature n'a pas pu être créée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier une candidature
    static async updateCandidature(req, res) {
        const id = parseInt(req.params.id);
        try {
            const updatedCandidature = await sequelize.transaction(async (t) => {
                const [affectedRows] = await Candidature.update(req.body, { where: { id }, transaction: t });
                if (!affectedRows) throw new Error('not_found');
                return await Candidature.findByPk(id, { transaction: t });
            });

            const message = `La candidature a été mise à jour avec succès.`;
            return res.json({ message, data: updatedCandidature });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: "Candidature introuvable." });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `La candidature n'a pas pu être mise à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour modifier uniquement le statut d'une candidature et créer une notification
    static async updateCandidatureStatus(req, res) {
        const id = parseInt(req.params.id);
        const { statut } = req.body;

        try {
            const updatedCandidature = await sequelize.transaction(async (t) => {
                const candidature = await Candidature.findByPk(id, { transaction: t });
                if (!candidature) throw new Error('candidature_not_found');

                candidature.statut = statut;
                await candidature.save({ transaction: t });

                const offre = await Offre.findByPk(candidature.OffreId, { transaction: t });
                if (!offre) throw new Error('offre_not_found');

                const etudiant = await Etudiant.findByPk(candidature.EtudiantId, { transaction: t });
                const utilisateur = etudiant ? await Utilisateur.findByPk(etudiant.UtilisateurId, { transaction: t }) : null;

                if (utilisateur) {
                    await notificationController.addNotification({
                        UtilisateurId: utilisateur.id,
                        message: `Le statut de votre candidature pour l'offre ${offre.titre} a été mis à jour : ${statut}`,
                        type: 'simple',
                        date_reception: new Date()
                    });
                }

                return candidature;
            });

            const message = `Le statut de la candidature a été mis à jour avec succès.`;
            return res.json({ message, data: updatedCandidature });

        } catch (error) {
            if (error.message === 'candidature_not_found') {
                return res.status(404).json({ message: "Candidature introuvable." });
            }
            if (error.message === 'offre_not_found') {
                return res.status(404).json({ message: "Offre introuvable." });
            }
            const message = `Le statut de la candidature n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour supprimer une candidature
    static async deleteCandidature(req, res) {
        const id = parseInt(req.params.id);

        try {
            const deletedCandidature = await sequelize.transaction(async (t) => {
                const candidature = await Candidature.findByPk(id, { transaction: t });
                if (!candidature) throw new Error('not_found');

                await Candidature.destroy({ where: { id }, transaction: t });
                return candidature;
            });

            const message = `La candidature a été supprimée avec succès.`;
            return res.json({ message, data: deletedCandidature });

        } catch (error) {
            if (error.message === 'not_found') {
                return res.status(404).json({ message: "Candidature introuvable." });
            }
            const message = `La candidature n'a pas pu être supprimée. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error });
        }
    }

    static async getCandidatureCard(req, res) {
        try {
            const id = req.params.id;

            if (!id) {
            return res.status(400).json({ message: "ID de l'offre manquant." });
            }

            const candidatures = await Candidature.findAll({
            where: { OffreId: id },
            include: [
                {
                model: Etudiant,
                attributes: ['id', 'nom', 'prenom', 'ecole', 'niveau'],
                include: [
                    {
                    model: Utilisateur,
                    attributes: ['photo', 'email'],
                    },
                ],
                },
            ],
            });

            // if (!candidatures.length) {
            //     return res.status(404).json({ message: "Aucune candidature trouvée pour cette offre." });
            // }

            const data = candidatures.map(c => ({
            idCandidature: c.id,
            nom: `${c.Etudiant.nom} ${c.Etudiant.prenom}`,
            photo: c.Etudiant?.Utilisateur?.photo || null,
            email: c.Etudiant?.Utilisateur?.email || null,
            ecole: c.Etudiant.ecole,
            niveau: c.Etudiant.niveau,
            }));

            const message = "Les candidatures ont été récupérées avec succès.";
            return res.json({ message, data });

        } catch (error) {
            console.error(error);
            const message = "Les candidatures n'ont pas pu être récupérées. Réessayez plus tard.";
            return res.status(500).json({ message, data: error.message });
        }
    }

    // récupérer une candidature spécifique
    static async getCandidatureById(req, res) {
        try {
            const id = req.params.id;

            if (!id) {
            return res.status(400).json({ message: "ID de la candidature manquante." });
            }

            const candidature = await Candidature.findByPk(id, {
            include: [
                {
                    model: Etudiant,
                    attributes: ['id', 'nom', 'prenom'],
                    include: [
                        {
                        model: Utilisateur,
                        attributes: ['photo'],
                        },
                    ],
                }
            ],
            });


            const data = {
                idCandidature: candidature.id,
                nom: `${candidature.Etudiant.nom} ${candidature.Etudiant.prenom}`,
                statut : candidature.statut,
                photo : candidature.Etudiant.Utilisateur.photo,
                cv_path : candidature.cv_path,
                lm_path : candidature.lm_path
            }

            const message = "La candidature ont été récupérées avec succès.";
            return res.json({ message, data });

        } catch (error) {
            console.error(error);
            const message = "La candidature n'a pas pu être récupérée. Réessayez plus tard.";
            return res.status(500).json({ message, data: error.message });
        }
    }

    

}

module.exports = CandidatureController;
