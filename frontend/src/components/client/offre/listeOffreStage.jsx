import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Loader2,
  AlertTriangle,
  Inbox,
  Search,
  Calendar,
  Briefcase,
  ChevronRight,
} from "lucide-react";

// --- Configuration et Helpers SWR/API ---

const fetcher = (...args) =>
  fetch(...args, { credentials: "include" }).then(async (res) => {
    if (!res.ok) {
      const error = new Error(
        "Une erreur est survenue lors de la récupération des offres."
      );
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  });

// Helper pour formater la période
const formatPeriode = (periode) => {
  if (!periode || !periode.date_debut || !periode.date_fin) {
    return "Période inconnue";
  }

  const start = new Date(periode.date_debut);
  const end = new Date(periode.date_fin);

  // Vérification de validité
  const isValidDate = (date) => !isNaN(date);

  if (!isValidDate(start) || !isValidDate(end)) {
    return "Dates invalides";
  }

  const formatMonth = (date) => format(date, "MMMM", { locale: fr });

  const diffDays = differenceInDays(end, start);
  // Afficher en mois si la différence est > 20 jours
  const months = Math.round(diffDays / 30);
  const duration = months > 0 ? `${months} mois` : `${diffDays} jours`;

  return `De ${formatMonth(start)} à ${formatMonth(end)} (${duration})`;
};

// Helper pour formater la liste des profils

const formatProfils = (profils) => {
  if (!profils || profils.length === 0) {
    return "Non spécifié";
  }

  // Mappe chaque profil pour obtenir la chaîne "nomProfil(nbStagiaires)"
  const formattedArray = profils.map((p) => {
    // S'assure que nbStagiaires est disponible (avec une valeur par défaut de 1 si non)
    const nb = p.nbStagiaires || 1;
    return `${p.nomProfil} (${nb})`;
  });

  // Joint toutes les chaînes avec ", "
  return formattedArray.join(", ");
};

// --- Composant Carte d'Offre ---

const OffreCard = ({ offre }) => {
  const profils = offre.Profils || [];
  const formattedProfils = formatProfils(profils);
  const formattedPeriode = formatPeriode(offre.Periode);

  return (
    <div
      className="bg-white p-4 md:p-6 border border-gray-200 rounded-xl shadow-sm
      animate-[text-appear-bottom_0.3s_ease-in] hover:shadow-lg hover:border-sky-400
      transition duration-200 ease-in-out"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Informations Principales */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2
            className="text-xl font-bold text-gray-800 mb-1"
            title={offre.titre}
          >
            {offre.titre}
          </h2>

          {/* Profils */}
          <p className="text-sm text-gray-600 flex items-start sm:items-center gap-2 min-w-0">
            <Briefcase
              size={16}
              className="text-sky-500 flex-shrink-0 mt-0.5 sm:mt-0"
            />
            <span className="font-semibold hidden sm:block text-gray-700 ">
              Profil :
            </span>
            <span>{formattedProfils}</span>
          </p>

          {/* Période */}
          <p className="text-sm text-gray-600 flex items-center gap-2 min-w-0">
            <Calendar size={16} className="text-gray-500 flex-shrink-0" />
            <span className="font-medium truncate">{formattedPeriode}</span>
          </p>
        </div>

        {/* Bouton d'Action/Statut */}
        <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
          {offre.dejaPostule ? (
            <div
              className="flex justify-center items-center h-10 px-4 py-2
              bg-sky-50 text-sky-700 font-semibold rounded-lg text-xs
              border border-sky-200 whitespace-nowrap"
            >
              Déjà postulé
            </div>
          ) : (
            // Bouton Postuler
            <button
              className="w-full sm:w-auto h-10 px-6 flex justify-center items-center gap-1
              bg-sky-600 text-white rounded-lg text-sm font-medium shadow-md
              duration-300 hover:bg-sky-700 hover:shadow-lg transition-colors cursor-pointer"
              aria-label={`Postuler pour l'offre ${offre.titre}`}
            >
              Postuler <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Composant Principal ---

export default function ListeOffresStage() {
  const ApiUrl =
    import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL || "";
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Récupérer l'ID de l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("utilisateur"));
      if (userData && userData.id) {
        setUserId(userData.id);
      } else {
        console.warn("Utilisateur non authentifié ou ID manquant.");
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage:", error);
    }
  }, []);

  // 2. Construire l'URL de l'API et fetcher avec SWR
  const apiUrl = userId ? `${ApiUrl}/offre/st/${userId}` : null;
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  // 3. Logique de recherche (Filtrage)
  const filteredOffres = useMemo(() => {
    const offres = Array.isArray(data?.data) ? data.data : [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (!lowerSearchTerm) {
      return offres;
    }

    return offres.filter(
      (offre) =>
        offre.titre.toLowerCase().includes(lowerSearchTerm) ||
        (offre.Profils &&
          offre.Profils.some((p) =>
            p.nomProfil.toLowerCase().includes(lowerSearchTerm)
          ))
    );
  }, [data, searchTerm]);

  // 4. Gestion du clic Postuler (à implémenter)

  // 5. Rendu du contenu (États de chargement, erreur, vide)
  const renderContent = () => {
    if (isLoading || !userId) {
      return (
        <div className="flex flex-col items-center justify-center p-10 h-64 bg-gray-50 rounded-xl shadow-inner">
          <Loader2 size={48} className="text-sky-500 animate-spin" />
          <p className="mt-4 text-gray-600">
            Chargement des offres de stage...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-10 h-64 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle size={48} className="text-red-500" />
          <p className="mt-4 font-semibold text-red-600 text-center">
            {error.info?.message ||
              "Erreur lors de la récupération des offres."}
          </p>
          <p className="text-gray-600 text-sm">
            Veuillez vérifier votre connexion ou réessayer.
          </p>
        </div>
      );
    }

    if (filteredOffres.length === 0 && data?.data.length > 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 h-64 bg-gray-50 border-2 border-dashed rounded-lg">
          <Search size={48} className="text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Aucune offre ne correspond à votre recherche.
          </p>
          <p className="text-gray-500">Essayez un autre mot-clé.</p>
        </div>
      );
    }

    if (filteredOffres.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 h-64 bg-gray-50 border-2 border-dashed rounded-lg">
          <Inbox size={48} className="text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Aucune offre de stage disponible pour le moment.
          </p>
          <p className="text-gray-500">Revenez plus tard !</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 pr-1">
        {" "}
        {filteredOffres.map((offre) => (
          <OffreCard key={offre.id} offre={offre} />
        ))}
      </div>
    );
  };

  return (
    // Conteneur Principal
    <div
      className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8
      animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-6"
    >
      {/* Header et Barre de Recherche */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Titre */}
        <div className="flex justify-between items-end flex-wrap gap-4 min-w-0">
          <h1 className="montserrat-hero font-bold text-xl text-sky-400 truncate">
            Trouver un stage
          </h1>
        </div>

        {/* Champ de Recherche */}
        <div className="relative w-full sm:w-auto sm:min-w-72 flex-shrink-0">
          <input
            type="text"
            placeholder="Rechercher par titre ou profil..."
            className="pl-10 z-10 pr-4 py-2 input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Champ de recherche d'offres de stage"
          />
          <Search
            size={16}
            className="text-gray-400 absolute top-3 left-3 z-20"
          />
        </div>
      </div>

      {/* Liste des Offres */}
      <div className="flex-1 h-full overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
