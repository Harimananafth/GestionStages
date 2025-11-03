import { useEffect, useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import useSWR from "swr";
import { ROUTES } from "../../../routes/paths";
import {
  Calendar,
  User,
  Check,
  X,
  Clock,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NIVEAUX = ["Tous les niveaux", "L1", "L2", "L3", "M1", "M2"];

const fetcher = (...args) =>
  fetch(args[0], { credentials: "include" }).then((res) => {
    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }
    return res.json();
  });

// Helper pour déterminer les classes de statut
const getStatusDetails = (statut) => {
  let statusClass = "badge-outline  truncate text-gray-600 bg-gray-100";
  let Icon = Clock;

  switch (statut) {
    case "Acceptée":
      statusClass = "badge-success badge-soft truncate ";
      Icon = Check;
      break;
    case "Refusée":
      statusClass = "badge-error badge-soft truncate ";
      Icon = X;
      break;
    case "En attente":
      statusClass = "badge-warning badge-soft truncate ";
      Icon = Clock;
      break;
  }
  return { statusClass, Icon, statusText: statut };
};

// Composant de ligne pour la table (Vue Desktop)
const CandidatureRow = ({ candidat, navigate }) => {
  const {
    nom,
    profilPostule,
    niveau,
    date_depot,
    statut,
    titre,
    idCandidature,
  } = candidat;

  const formattedDate = date_depot
    ? format(new Date(date_depot), "dd-MM-yyyy")
    : "N/A";

  const { statusClass, statusText } = getStatusDetails(statut);

  return (
    <tr
      className="hover:bg-gray-100 transition duration-150 cursor-pointer"
      onClick={() =>
        navigate(ROUTES.ADMIN.CANDIDATURE_ACTION(idCandidature), {
          state: { titre },
        })
      }
    >
      <td className="font-semibold text-gray-800 flex items-center gap-3">
        <User size={18} className="text-sky-500 hidden sm:inline" />
        {nom}
      </td>
      <td>{titre}</td>
      <td>{profilPostule}</td>
      <td>{niveau}</td>
      <td>{formattedDate}</td>
      <td>
        <div className={`badge ${statusClass} text-xs`}>{statusText}</div>
      </td>
    </tr>
  );
};

// Composant de carte  (Vue Mobile)
const CandidatureCard = ({ candidat, navigate }) => {
  const {
    nom,
    profilPostule,
    niveau,
    date_depot,
    statut,
    titre,
    idCandidature,
  } = candidat;

  const formattedDate = date_depot
    ? format(new Date(date_depot), "dd-MM-yyyy")
    : "N/A";

  const { statusClass, statusText, Icon } = getStatusDetails(statut);

  return (
    <div
      key={idCandidature}
      className="card bg-white shadow-md mb-4 p-4 border border-gray-200 
                        animate-[text-appear-bottom_0.3s_ease-in] hover:bg-gray-50 cursor-pointer"
      onClick={() =>
        navigate(ROUTES.ADMIN.CANDIDATURE_ACTION(idCandidature), {
          state: { titre },
        })
      }
    >
      <div className="flex justify-between items-start">
        <h2 className="text-base font-bold text-sky-600 flex items-center gap-2">
          <User size={16} /> {nom}
        </h2>
        <div className={`badge ${statusClass} text-xs flex items-center gap-1`}>
          <Icon size={12} /> {statusText}
        </div>
      </div>
      <div className="divider my-1"></div>
      <p className="text-sm">
        <span className="font-semibold text-gray-700">Offre : </span>
        {titre}
      </p>
      <p className="text-sm">
        <span className="font-semibold text-gray-700">Poste: </span>
        {profilPostule}
      </p>
      <p className="text-sm mt-1">
        <span className="font-semibold text-gray-700">Niveau: </span>
        {niveau}
      </p>
      <p className="text-xs mt-2 text-gray-500 flex items-center gap-1">
        <Calendar size={12} className="text-gray-400" />
        <span className="font-semibold">Déposé le: </span>
        {formattedDate}
      </p>
    </div>
  );
};

// Composant de l'en-tête de la table pour le tri
const SortableHeader = ({ title, column, sortColumn, sortOrder, onSort }) => {
  const isActive = sortColumn === column;
  const isAsc = sortOrder === "asc";

  return (
    <th
      className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {title}
        {/* Affiche l'icône de tri seulement si la colonne est active */}
        {isActive ? (
          isAsc ? (
            <ArrowUp size={14} className="text-sky-500" />
          ) : (
            <ArrowDown size={14} className="text-sky-500" />
          )
        ) : (
          // Ajoute les deux flèches pour indiquer que la colonne est triable
          <div className="flex flex-col opacity-30">
            <ArrowUp size={8} className="-mb-1" />
            <ArrowDown size={8} />
          </div>
        )}
      </div>
    </th>
  );
};

// Composant principal
export default function MainAdminCandidatures() {
  const ApiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_API_URL;
  const {
    data: rawData,
    error,
    isLoading,
  } = useSWR(`${ApiUrl}/candidature/`, fetcher);

  // États pour le filtrage
  const [filterProfil, setFilterProfil] = useState("Tous les profils");
  const [filterNiveau, setFilterNiveau] = useState("Tous les niveaux");
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  // États pour le tri
  const [sortColumn, setSortColumn] = useState("date_depot"); // Colonne par défaut
  const [sortOrder, setSortOrder] = useState("desc"); // Ordre par défaut (plus récent d'abord)

  useEffect(() => {
    document.title = "Toutes les Candidatures";
  }, []);

  const candidatures = rawData?.data || [];

  // Détermination des options de profils uniques (dynamiques)
  const profilsUniques = useMemo(
    () => [
      "Tous les profils",
      ...new Set(candidatures.map((c) => c.profilPostule)),
    ],
    [candidatures]
  );

  // Fonction de réinitialisation des filtres
  const resetFilters = useCallback(() => {
    setFilterProfil("Tous les profils");
    setFilterNiveau("Tous les niveaux");
    setFilterDate("");
    setSortColumn("date_depot");
    setSortOrder("desc");
  }, []);

  // Fonction de gestion du tri
  const handleSort = useCallback(
    (column) => {
      if (column === sortColumn) {
        // Inverser l'ordre si on clique sur la même colonne
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        // Nouvelle colonne, trier par défaut en 'asc' (ou 'desc' pour la date)
        setSortColumn(column);
        setSortOrder(column === "date_depot" ? "desc" : "asc");
      }
    },
    [sortColumn, sortOrder]
  );

  // 1. Filtrage des données
  const filteredCandidatures = useMemo(() => {
    return candidatures.filter((c) => {
      // 1. Filtrer par Profil
      if (
        filterProfil !== "Tous les profils" &&
        c.profilPostule !== filterProfil
      ) {
        return false;
      }
      // 2. Filtrer par Niveau
      if (filterNiveau !== "Tous les niveaux" && c.niveau !== filterNiveau) {
        return false;
      }
      // 3. Filtrer par Date
      if (filterDate) {
        const depotDate = new Date(c.date_depot).toISOString().split("T")[0];
        if (depotDate !== filterDate) {
          return false;
        }
      }
      return true;
    });
  }, [candidatures, filterProfil, filterNiveau, filterDate]);

  // 2. Tri des données filtrées
  const sortedCandidatures = useMemo(() => {
    if (filteredCandidatures.length === 0) return [];

    const sorted = [...filteredCandidatures].sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case "nom":
          aValue = a.nom.toLowerCase();
          bValue = b.nom.toLowerCase();
          break;
        case "profilPostule":
          aValue = a.profilPostule.toLowerCase();
          bValue = b.profilPostule.toLowerCase();
          break;
        case "niveau":
          // Tri personnalisé pour les niveaux (L1 < L2 < L3 < M1 < M2)
          const niveauOrder = NIVEAUX.reduce((acc, level, index) => {
            if (level !== "Tous les niveaux") acc[level] = index;
            return acc;
          }, {});
          aValue = niveauOrder[a.niveau] || 99; // 99 pour les niveaux non définis
          bValue = niveauOrder[b.niveau] || 99;
          break;
        case "date_depot":
          // Convertir en Date pour une comparaison correcte
          aValue = new Date(a.date_depot || 0).getTime();
          bValue = new Date(b.date_depot || 0).getTime();
          break;
        case "statut":
          aValue = a.statut.toLowerCase();
          bValue = b.statut.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredCandidatures, sortColumn, sortOrder]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
        <span className="loading loading-dots loading-xl text-sky-500"></span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="upEntry text-error font-normal text-xl grow flex items-center justify-center p-10">
        <p>Erreur lors du chargement des candidatures.</p>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 
                         animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-2"
    >
      <h1 className="montserrat-hero font-bold text-xl text-sky-400">
        Toutes les candidatures
      </h1>

      {/* Zone de Filtrage  */}
      <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-start sm:items-center gap-3 lg:gap-4 py-3 border-b border-gray-100 pb-4">
        {/* Filtre Profil */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-semibold text-gray-700 hidden sm:inline lg:block lg:w-auto">
            Profil :
          </span>
          <select
            value={filterProfil}
            onChange={(e) => setFilterProfil(e.target.value)}
            className="select select-sm select-bordered w-full lg:w-auto text-xs font-medium focus:border-sky-500 focus:outline-none h-8 min-h-8"
          >
            {profilsUniques.map((profil) => (
              <option key={profil} value={profil}>
                {profil}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Niveau d'études */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-semibold text-gray-700 hidden sm:inline lg:block lg:w-auto">
            Niveau :
          </span>
          <select
            value={filterNiveau}
            onChange={(e) => setFilterNiveau(e.target.value)}
            className="select select-sm select-bordered w-full lg:w-auto text-xs font-medium focus:border-sky-500 focus:outline-none h-8 min-h-8"
          >
            {NIVEAUX.map((niveau) => (
              <option key={niveau} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Date de candidature */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-semibold text-gray-700 hidden sm:inline lg:block lg:w-auto">
            Date :
          </span>
          <div className="relative flex items-center h-8 w-full lg:w-auto">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input input-sm input-bordered w-full lg:w-auto text-xs font-medium pr-8 focus:border-sky-500 focus:outline-none"
              placeholder="jj/mm/aaaa"
            />
          </div>
        </div>

        {/* Bouton Réinitialiser les filtres */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 mt-2 sm:mt-0"
        >
          <RotateCcw size={14} />
          Réinitialiser les filtres
        </button>
      </div>

      {/* Contenu principal : Tableau (Desktop) ou Cartes (Mobile) */}
      <div className="flex-1 overflow-x-auto mt-4">
        {sortedCandidatures.length > 0 ? (
          <>
            {/* Vue Tableau (Desktop/Large screen) */}
            <div className="hidden lg:block">
              <table className="table table-zebra w-full min-w-[800px] ">
                <thead className="text-black text-sm">
                  <tr className="bg-gray-50">
                    {/* Tri sur 'nom' */}
                    <SortableHeader
                      title="Nom"
                      column="nom"
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      title="Offre"
                      column="titre"
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      title="Profil postulé"
                      column="profilPostule"
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      title="Niveau"
                      column="niveau"
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      title="Date de dépôt"
                      column="date_depot"
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      title="Statut"
                      column="statut"
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </tr>
                </thead>
                <tbody>
                  {sortedCandidatures.map((candidat) => (
                    <CandidatureRow
                      key={candidat.idCandidature}
                      candidat={candidat}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vue Cartes (Mobile/Small screen) */}
            <div className="lg:hidden space-y-3">
              {sortedCandidatures.map((candidat) => (
                <CandidatureCard
                  key={candidat.idCandidature}
                  candidat={candidat}
                  navigate={navigate}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 font-medium p-10">
            <p>
              Aucune candidature ne correspond aux critères de filtre
              sélectionnés.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
