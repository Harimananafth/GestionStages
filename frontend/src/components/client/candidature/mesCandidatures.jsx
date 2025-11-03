import { useEffect, useState } from "react";
import useSWR from "swr";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Loader2,
  AlertTriangle,
  Inbox,
  Trash2,
  Clock,
  Check,
  X,
  EllipsisVertical,
  FileText,
  File,
} from "lucide-react";
import CancelCandidatureModal from "./cancelCandidatureModal";

const fetcher = (...args) =>
  fetch(...args, { credentials: "include" }).then(async (res) => {
    if (!res.ok) {
      const error = new Error(
        "Une erreur est survenue lors de la récupération des données."
      );
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  });

// Helper pour le style des badges de statut
const getStatusBadge = (statut) => {
  switch (statut) {
    case "Acceptée":
      return "badge badge-success badge-soft text-xs ";
    case "Refusée":
      return "badge badge-error badge-soft text-xs ";
    case "En attente":
      return "badge badge-warning badge-soft text-xs ";
    default:
      return "badge badge-soft text-xs ";
  }
};

// Helper pour l'icône du statut
const getStatusIcon = (statut) => {
  switch (statut) {
    case "Acceptée":
      return <Check size={12} className="text-green-600" />;
    case "Refusée":
      return <X size={12} className="text-red-600" />;
    case "En attente":
      return <Clock size={12} className="text-amber-600" />;
    default:
      return null;
  }
};

/**
 * Carte individuelle pour une candidature
 */
const CandidatureCard = ({ candidature, onCancel, ApiUrl }) => {

  const formattedDate = candidature.date_candidature
    ? format(new Date(candidature.date_candidature), "d MMMM yyyy", {
        locale: fr,
      })
    : "Date inconnue";

  const profilNom = candidature.Profil?.nomProfil || "Profil non spécifié";

  // Construire l'URL sécurisée pointant vers le PROXY Express
  const candidatureId = candidature.id;
  const cvLinkSecure = `${ApiUrl}/file/${candidatureId}/view?type=cv`;
  const lmLinkSecure = `${ApiUrl}/file/${candidatureId}/view?type=lm`;

  // On vérifie toujours l'existence des IDs pour activer/désactiver le lien
  const cvId = candidature.cv_public_id;
  const lmId = candidature.lm_public_id;


  return (
    <div
      className="bg-base-100 p-3 md:p-6 border border-gray-200 rounded-xl
                        animate-[text-appear-bottom_0.3s_ease-in] hover:bg-gray-50 transition duration-150 ease-in-out"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Informations Principales */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {candidature.Offre?.titre || "Titre de l'offre non disponible"}
          </h3>
          <p className="text-xs text-gray-500">
            Profil postulé :{" "}
            <span className="font-semibold text-gray-600">{profilNom}</span>
          </p>
          <p className="text-xs text-gray-500">
            Postulé le :{" "}
            <span className="font-semibold text-gray-600">{formattedDate}</span>
          </p>
        </div>

        {/* Statut et Actions */}
        <div className="flex md:flex-col items-center justify-between md:items-end gap-2 w-full md:w-auto flex-shrink-0">
          {/* Affichage du Statut */}
          <div className="flex items-center gap-1">
            <span className="text-sm hidden md:block text-gray-600 font-medium mr-2">
              Statut :
            </span>
            <div className={getStatusBadge(candidature.statut) + "truncate"}>
              {getStatusIcon(candidature.statut)}
              {candidature.statut}
            </div>
          </div>

          {/* Menu d'Actions */}
          <div
            className="dropdown dropdown-end md:w-auto mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton du menu (EllipsisVertical) */}
            <EllipsisVertical
              tabIndex={0}
              size={24}
              role="button"
              className="text-gray-600 rounded-lg text-sm font-medium duration-300 hover:cursor-pointer p-1 hover:bg-gray-200"
            />

            {/* Contenu du menu */}
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-[1] w-48 p-2 shadow-xl text-sm font-medium bg-white border border-gray-100"
            >
              {/* Option Voir le CV */}
              <li>
                <a
                  className={`flex justify-start items-center gap-2 ${
                    !cvId
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-sky-600 cursor-pointer"
                  }`}
                  // Le lien href pointe maintenant vers la route Express sécurisée
                  href={cvId ? cvLinkSecure : "#"}
                  target="_blank"
                  // S'assurer que le clic n'a pas d'effet si pas de CV 
                  onClick={(e) => !cvId && e.preventDefault()}
                  rel="noopener noreferrer"
                >
                  <File size={16} />
                  Voir le CV
                </a>
              </li>

              {/* Option Voir la lettre de motivation */}
              <li>
                <a
                  className={`flex justify-start items-center gap-2 ${
                    !lmId
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-sky-600 cursor-pointer"
                  }`}
                  // Le lien href pointe maintenant vers la route Express sécurisée
                  href={lmId ? lmLinkSecure : "#"}
                  target="_blank"
                  // S'assurer que le clic n'a pas d'effet si pas de LM
                  onClick={(e) => !lmId && e.preventDefault()}
                  rel="noopener noreferrer"
                >
                  <FileText size={16} />
                  Voir la lettre
                </a>
              </li>

              {/* Option Annuler (conditionnelle)  */}
              {candidature.statut === "En attente" && (
                <>
                  {/* Séparateur pour distinguer l'action de suppression */}
                  <div className="my-1 h-px bg-gray-200" />
                  <li>
                    <a
                      className="flex text-error justify-start items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(candidature);
                      }}
                    >
                      <Trash2 size={16} />
                      Annuler la candidature
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant principal de la page "Mes Candidatures"
 */
export default function MesCandidatures() {
const ApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;
  const [userId, setUserId] = useState(null);
  const [candidatureToCancel, setCandidatureToCancel] = useState(null);

  // 1. Récupérer l'ID de l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    document.title = "Mes candidatures";
    try {
      const userData = JSON.parse(localStorage.getItem("utilisateur"));
      if (userData && userData.id) {
        setUserId(userData.id);
      } else {
        console.warn(
          "Utilisateur non authentifié ou ID manquant dans localStorage."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage:", error);
    }
  }, []);

  // 2. Construire l'URL de l'API et fetcher avec SWR
  const apiUrl = userId ? `${ApiUrl}/candidature/st/${userId}` : null;
  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher);

  // 3. Gestion de l'ouverture du modal d'annulation
  const handleCancelClick = (candidature) => {
    setCandidatureToCancel(candidature);
    document.getElementById("cancel_candidature_modal").showModal();
  };

  // 4. Rendu du contenu
  const renderContent = () => {
    if (isLoading || !userId) {
      return (
        <div className="flex flex-col items-center justify-center p-10 h-64 bg-white rounded-xl shadow-inner">
          <Loader2 size={48} className="text-sky-500 animate-spin" />
          <p className="mt-4 text-gray-600">
            Chargement de vos candidatures...
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
              "Une erreur est survenue lors de la récupération des données."}
          </p>
          <p className="text-gray-600 text-sm">
            Veuillez vérifier votre connexion ou réessayer plus tard.
          </p>
        </div>
      );
    }

    const candidatures = data?.candidatures || [];

    if (candidatures.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
          <Inbox size={48} className="text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Aucune candidature trouvée.
          </p>
          <p className="text-gray-500">
            Vous n'avez pas encore postulé à une offre.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {candidatures.map((candidature) => (
          <CandidatureCard
            key={candidature.id}
            candidature={candidature}
            onCancel={handleCancelClick}
            ApiUrl={ApiUrl}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 
                         animate-[text-appear-bottom_0.5s_ease-in] overflow-auto flex flex-col gap-6"
    >
      {/* Titre */}
      <h1 className="montserrat-hero font-bold text-xl text-sky-400">
        Mes Candidatures{" "}
        <span className="text-lg font-normal text-gray-500">
          ({data?.candidatures.length || 0})
        </span>
      </h1>

      <div className="flex-1">{renderContent()}</div>

      {/* Modal de confirmation d'annulation */}
      <CancelCandidatureModal
        candidature={candidatureToCancel}
        mutate={mutate}
        apiUrl={`${ApiUrl}/candidature`} 
      />
    </div>
  );
}
