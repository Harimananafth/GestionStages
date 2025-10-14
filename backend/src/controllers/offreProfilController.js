const { OffreProfil, sequelize } = require('../Models');

class OffreProfilController {

    // Méthode pour attribuer un profil à une offre
    static async assignProfilToOffre(req, res) {
        try {
            const offreProfil = await sequelize.transaction(async (t) => {
                return await OffreProfil.create(req.body, { transaction: t });
            });

            const message = `Le profil a été attribué à l'offre avec succès.`;
            res.json({ message, data: offreProfil });

        } catch (error) {
            const message = `Le profil n'a pas pu être attribué à l'offre. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour retirer un profil d'une offre
    static async removeProfilFromOffre(req, res) {
        const { OffreId, ProfilId } = req.params;

        try {
            const deletedCount = await sequelize.transaction(async (t) => {
                return await OffreProfil.destroy({
                    where: { OffreId, ProfilId },
                    transaction: t
                });
            });

            if (deletedCount === 0) {
                const message = `Aucun profil trouvé pour l'offre spécifiée.`;
                return res.status(404).json({ message });
            }

            const message = `Le profil a été retiré de l'offre avec succès.`;
            res.json({ message });

        } catch (error) {
            const message = `Le profil n'a pas pu être retiré de l'offre. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour lister tous les profils d'une offre
    static async getProfilsOfOffre(req, res) {
        const { OffreId } = req.params;

        try {
            const profils = await OffreProfil.findAll({
                where: { OffreId }
            });

            const message = `Liste des profils de l'offre récupérée avec succès.`;
            res.json({ message, data: profils });

        } catch (error) {
            const message = `Impossible de récupérer les profils de l'offre.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Met à jour le nombre de profil
    static async updateProfilCount(req, res) {
        try {
            const { OffreId, ProfilId } = req.params;
            const { nbProfil } = req.body;

            // Vérifie que la liaison existe
            const offreProfil = await OffreProfil.findOne({ where: { OffreId, ProfilId } });

            if (!offreProfil) {
            return res.status(404).json({ message: "Aucune correspondance Offre/Profil trouvée." });
            }

            // Met à jour le nombre de profils
            offreProfil.nbProfil = nbProfil;
            await offreProfil.save();

            return res.status(200).json({ message: "Nombre de profils mis à jour avec succès.", offreProfil });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil." });
        }
        }

}

module.exports = OffreProfilController;
