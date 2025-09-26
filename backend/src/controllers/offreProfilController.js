const { OffreProfil } = require('../Models');

class OffreProfilController {

    // Méthode pour attribuer un profil à une offre
    static async assignProfilToOffre(req, res) {
        try {
            const offreProfil = await OffreProfil.create(req.body);

            const message = `Le profil a été attribué à l'offre avec succès.`;
            res.json({ message, data: offreProfil });

        } catch (error) {
            const message = `Le profil n'a pas pu être attribué à l'offre. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    }

    // Méthode pour retirer un profil d'une offre
    static async removeProfilFromOffre(req, res) {
        const { offreId, profilId } = req.params;

        try {
            const deletedCount = await OffreProfil.destroy({
                where: { offreId, profilId }
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
        const { offreId } = req.params;

        try {
            const profils = await OffreProfil.findAll({
                where: { offreId }
            });

            const message = `Liste des profils de l'offre récupérée avec succès.`;
            res.json({ message, data: profils });

        } catch (error) {
            const message = `Impossible de récupérer les profils de l'offre.`;
            res.status(500).json({ message, data: error });
        }
    }
}

module.exports = OffreProfilController;
