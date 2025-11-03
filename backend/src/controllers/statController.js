const { Candidature, Offre, Profil, Etudiant, sequelize } = require('../models');
const { fn, col, literal } = require('sequelize');

class StatistiqueController {
  static async getAllStats(req, res) {
    try {
      const currentYear = new Date().getFullYear();

      const [
        globalCounts,
        candidaturesByProfil,
        candidaturesByStatut,
        candidaturesByMonth
      ] = await Promise.all([

        // Une seule requête pour compter candidatures, offres et étudiants
        Promise.all([
          Candidature.count(),
          Offre.count(),
          Etudiant.count()
        ]),

        // Candidatures par profil
        sequelize.query(
          `
            SELECT p."nomProfil" AS profil, COUNT(c."id") AS total
            FROM "candidatures" c
            LEFT JOIN "offres" o ON c."OffreId" = o."id"
            LEFT JOIN "offreProfils" op ON o."id" = op."OffreId"
            LEFT JOIN "profils" p ON op."ProfilId" = p."id"
            GROUP BY p."nomProfil"
            ORDER BY p."nomProfil";
          `,
          { type: sequelize.QueryTypes.SELECT }
        ),

        // Candidatures par statut
        Candidature.findAll({
          attributes: ['statut', [fn('COUNT', col('statut')), 'count']],
          group: ['statut'],
          raw: true
        }),

        // Candidatures par mois (année courante)
        sequelize.query(
          `
            SELECT EXTRACT(MONTH FROM "date_candidature") AS mois, COUNT(*) AS total
            FROM "candidatures"
            WHERE EXTRACT(YEAR FROM "date_candidature") = :year
            GROUP BY mois
            ORDER BY mois ASC;
          `,
          {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
          }
        )
      ]);

      const [totalCandidatures, totalOffres, totalEtudiants] = globalCounts;

      // Remplir les mois manquants
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const found = candidaturesByMonth.find(m => parseInt(m.mois) === i + 1);
        return { mois: i + 1, total: found ? parseInt(found.total) : 0 };
      });

      return res.json({
        message: "Statistiques globales récupérées avec succès.",
        data: {
          totalCandidatures,
          totalOffres,
          totalEtudiants,
          candidaturesByProfil,
          candidaturesByStatut,
          candidaturesByMonth: monthlyData
        }
      });

    } catch (error) {
      console.error("Erreur Statistiques:", error);
      return res.status(500).json({
        message: "Erreur lors de la récupération des statistiques.",
        data: error.message
      });
    }
  }

  static async userStats(req, res){
    try{

      const etudiant = await Etudiant.findOne({where : { UtilisateurId : req.user.id}})
      const id = etudiant.id

      const nbCandidaturesList = await Candidature.findAll({where: {EtudiantId: id}})
      const accepteesList = await Candidature.findAll({where: {EtudiantId: id, statut: "Acceptée"}})
      const refuseesList = await Candidature.findAll({where: {EtudiantId: id, statut: "Refusée"}})
      const attentesList = await Candidature.findAll({where: {EtudiantId: id, statut: "En attente"}})

      return res.json({
        message: "Statistiques globales récupérées avec succès.",
        data: {
          nbCandidatures : nbCandidaturesList.length,
          acceptees : accepteesList.length,
          refusees : refuseesList.length,
          attentes : attentesList.length,
        }
      });

    }catch(error){
      console.error("Erreur Statistiques:", error);
      return res.status(500).json({
        message: "Erreur lors de la récupération des statistiques.",
        data: error.message
      });
    }
  }
}

module.exports = StatistiqueController;
