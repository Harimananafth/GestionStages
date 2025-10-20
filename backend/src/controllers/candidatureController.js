const { Candidature, Offre, Utilisateur, Etudiant, Profil, OffreProfil, sequelize } = require('../Models');
const { ValidationError, Op } = require('sequelize');
const notificationController = require('./notificationController');

// Fonction Helper pour vérifier et fermer une offre
async function checkAndCloseOffre(offreId, transaction) {
    const offre = await Offre.findByPk(offreId, {
        include: [{
            model: Profil,
            attributes: ['id'],
            through: { attributes: ['nbProfil'] }
        }],
        transaction
    });

    if (!offre || !offre.Profils) return;

    let totalPlacesRestantes = 0;

    // Boucler sur tous les profils requis par l'offre
    for (const profil of offre.Profils) {
        const totalSpots = profil.OffreProfil.nbProfil;

        // 2. Compter les acceptés pour ce profil
        const acceptedCount = await Candidature.count({
            where: {
                OffreId: offreId,
                ProfilId: profil.id,
                statut: 'Acceptée'
            },
            transaction
        });

        // Ajouter les places restantes de ce profil au total
        const remainingSpots = totalSpots - acceptedCount;
        if (remainingSpots > 0) {
            totalPlacesRestantes += remainingSpots;
        }
    }

    // Si 0 places restantes au total (tous profils confondus), fermer l'offre
    if (totalPlacesRestantes === 0) {
        offre.is_disponible = false;
        await offre.save({ transaction });
    }
    // Si on refuse une candidature, on pourrait rouvrir l'offre
    else if (totalPlacesRestantes > 0 && !offre.is_disponible) {
        offre.is_disponible = true;
        await offre.save({ transaction });
    }
}

class CandidatureController {

    // Méthode pour lister toutes les candidatures

    static async getAllcandidature(req, res) {

        try {
            const candidatures = await Candidature.findAll({
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
                {
                    model: Profil,
                    attributes: ['nomProfil']
                }
            ],
            });

            const data = candidatures.map(c => ({
                idCandidature: c.id,
                nom: `${c.Etudiant.nom} ${c.Etudiant.prenom}`,
                profilPostule: c.Profil ? c.Profil.nomProfil : 'N/A',
                date_depot: c.date_candidature,
                ecole: c.Etudiant.ecole,
                niveau: c.Etudiant.niveau,
                statut : c.statut
            }));

            const message = "Les candidatures ont été récupérées avec succès.";
            return res.json({ message, data });

        } catch (error)
         {
            console.error(error);
            const message = "Les candidatures n'ont pas pu être récupérées. Réessayez plus tard.";
            return res.status(500).json({ message, data: error.message });
        }

    }

    // Méthode pour ajouter une candidature
    static async createCandidature(req, res) {
        try {
            // Récupération des ID pour validation
            const { OffreId, ProfilId } = req.body;

            const candidature = await sequelize.transaction(async (t) => {
                
                // vérification : L'offre existe et est disponible
                const offre = await Offre.findByPk(OffreId, { transaction: t });
                if (!offre) throw new Error('offre_not_found');
                if (!offre.is_disponible) throw new Error('offre_not_disponible');

                // Vérification : Le profil est bien lié à l'offre
                const offreProfil = await OffreProfil.findOne({
                    where: { OffreId, ProfilId },
                    transaction: t
                });
                if (!offreProfil) throw new Error('profil_not_in_offre');

                // Création de la candidature
                const newCandidature = await Candidature.create(req.body, { transaction: t });

                // Création d'une notification associée (l'offre est déjà chargée)
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
            // AJOUT: Gestion des nouvelles erreurs
            if (error.message === 'offre_not_disponible') {
                return res.status(403).json({ message: "Cette offre n'est plus disponible pour les candidatures." });
            }
            if (error.message === 'profil_not_in_offre') {
                return res.status(400).json({ message: "Ce profil n'est pas requis pour cette offre." });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            console.error(error);
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

    // Méthode pour modifier uniquement le statut d'une candidature
    static async updateCandidatureStatus(req, res) {
        const id = parseInt(req.params.id);
        const { statut } = req.body;

        try {
            const updatedCandidature = await sequelize.transaction(async (t) => {
                const candidature = await Candidature.findByPk(id, { 
                    // Inclure l'offre pour la vérification
                    include: [Offre],
                    transaction: t 
                });
                
                if (!candidature) throw new Error('candidature_not_found');

                // Si le statut ne change pas, on ne fait rien
                if (candidature.statut === statut) {
                    return candidature;
                }
                
                // Logique de vérification si le nouveau statut est "Acceptée"
                if (statut === 'Acceptée') {
                    
                    // Vérification si l'offre est disponible 
                    if (!candidature.Offre || !candidature.Offre.is_disponible) {
                        throw new Error('offre_not_disponible');
                    }

                    // Trouver le nombre de places max pour ce profil dans cette offre
                    const offreProfil = await OffreProfil.findOne({
                        where: {
                            OffreId: candidature.OffreId,
                            ProfilId: candidature.ProfilId
                        },
                        transaction: t
                    });
                    if (!offreProfil) throw new Error('offre_profil_link_not_found');

                    // Compter les candidatures déjà acceptées pour cevprofil
                    const acceptedCount = await Candidature.count({
                        where: {
                            OffreId: candidature.OffreId,
                            ProfilId: candidature.ProfilId,
                            statut: 'Acceptée'
                        },
                        transaction: t
                    });

                    // Comparer
                    if (acceptedCount >= offreProfil.nbProfil) {
                        throw new Error('profil_plein');
                    }
                }

                // Si la logique passe (ou si statut = Refusée/En attente), on met à jour
                const oldStatus = candidature.statut;

                candidature.statut = statut;
                await candidature.save({ transaction: t });

                // Logique de notification
                const etudiant = await Etudiant.findByPk(candidature.EtudiantId, { transaction: t });
                const utilisateur = etudiant ? await Utilisateur.findByPk(etudiant.UtilisateurId, { transaction: t }) : null;

                if (utilisateur) {
                    await notificationController.addNotification({
                        UtilisateurId: utilisateur.id,
                        message: `Le statut de votre candidature pour l'offre ${candidature.Offre.titre} a été mis à jour : ${statut}`,
                        type: 'simple',
                        date_reception: new Date()
                    });
                }

                // Vérifie automatiquement fermeture ou réouverture
                if (statut === 'Acceptée' || (oldStatus === 'Acceptée' && statut === 'Refusée')) {
                    await checkAndCloseOffre(candidature.OffreId, t);
                }

                return candidature;

            });

            const message = `Le statut de la candidature a été mis à jour avec succès.`;
            return res.json({ message, data: updatedCandidature });

        } catch (error) {
            // Gestion des nouvelles erreurs
            if (error.message === 'offre_not_disponible') {
                return res.status(403).json({ message: "Impossible d'accepter la candidature : l'offre n'est plus disponible." });
            }
            if (error.message === 'profil_plein') {
                return res.status(409).json({ message: "Ce profil est déjà complet pour cette offre. Impossible d'accepter la candidature." });
            }
            // ...
            const message = `Le statut de la candidature n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error.message || error });
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
                {
                    model: Profil,
                    attributes: ['nomProfil']
                }
            ],
            });

            const data = candidatures.map(c => ({
                idCandidature: c.id,
                nom: `${c.Etudiant.nom} ${c.Etudiant.prenom}`,
                profilPostule: c.Profil ? c.Profil.nomProfil : 'N/A',
                date_depot: c.date_candidature,
                photo: c.Etudiant?.Utilisateur?.photo || null,
                email: c.Etudiant?.Utilisateur?.email || null,
                ecole: c.Etudiant.ecole,
                niveau: c.Etudiant.niveau,
                statut : c.statut
            }));

            const message = "Les candidatures ont été récupérées avec succès.";
            return res.json({ message, data });

        } catch (error)
         {
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
                },
                // Inclure le profil postulé
                {
                    model: Profil,
                    attributes: ['nomProfil']
                }
            ],
            });

            if (!candidature) {
                return res.status(404).json({ message: "Candidature introuvable." });
            }

            const data = {
                idCandidature: candidature.id,
                nom: `${candidature.Etudiant.nom} ${candidature.Etudiant.prenom}`,
                profilPostule: candidature.Profil ? candidature.Profil.nomProfil : 'N/A', // AJOUT
                statut : candidature.statut,
                photo : candidature.Etudiant?.Utilisateur?.photo || null,
                cv_path : candidature.cv_path,
                lm_path : candidature.lm_path
            }

            const message = "La candidature a été récupérée avec succès.";
            return res.json({ message, data });

        } catch (error) {
            console.error(error);
            const message = "La candidature n'a pas pu être récupérée. Réessayez plus tard.";
            return res.status(500).json({ message, data: error.message });
        }
    }
}

module.exports = CandidatureController;