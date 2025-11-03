import { FileText, MoveLeft, User, Check, X, Clock, FileUser } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useSWR from 'swr'


const fetcher = async (url) =>
    fetch(url, { credentials: 'include' }).then(async (res) => {
        if (!res.ok) {
            const error = new Error('Une erreur est survenue lors de la récupération de données');
            error.info = await res.json();
            error.status = res.status;
            throw error;
        }
        return res.json();
    });

export default function ActionOnCandidature() {
  const ApiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  // AJOUT: État pour gérer les messages de succès ou d'erreur suite à une action
  const [actionMessage, setActionMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const titre = location.state?.titre || "";

  const { data, error, isLoading, mutate } = useSWR(
    `${ApiUrl}/candidature/t/${id}`,
    fetcher
    );

  // Construire l'URL sécurisée pointant vers le PROXY Express
  const candidatureId = data?.data.idCandidature;
  const cvLinkSecure = `${ApiUrl}/file/${candidatureId}/view?type=cv`;
  const lmLinkSecure = `${ApiUrl}/file/${candidatureId}/view?type=lm`;

  // On vérifie toujours l'existence des IDs pour activer/désactiver le lien
  const cvId = data?.data.cv_public_id;
  const lmId = data?.data.lm_public_id;

  const handleUpdateStatus = async (statut) => {
    setLoading(true);
    setActionMessage(null); // Réinitialiser le message précédent

    try {
      const res = await fetch(`${ApiUrl}/candidature/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ statut: statut }),
      });

      const result = await res.json();

      if (res.ok) {
        // Succès
        setIsError(false);
        setActionMessage(`Statut de la candidature mis à jour à : ${statut}.`);
        mutate(); // Revalider les données SWR pour mettre à jour le statut affiché
      } else {
        // Erreur côté serveur (4xx, 5xx)
        setIsError(true);
        // Le message de l'API est souvent plus précis (ex: profil_plein, offre_not_disponible)
        const errorMessage =
          result.message ||
          `Erreur ${res.status} lors de la mise à jour du statut.`;
        setActionMessage(errorMessage);
      }
    } catch (err) {
      // Erreur réseau ou fetcher
      setIsError(true);
      setActionMessage(
        "Erreur réseau ou problème de connexion lors de la mise à jour."
      );
    } finally {
      setLoading(false);
      // Effacer le message après 5 secondes
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const profileImage = data?.data.photo ? (
    <img
      src={data.data.photo}
      alt={`Photo de profil de ${data.data.nom}`}
      className="w-16 h-16 rounded-full object-cover"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
      <User size={30} className="text-gray-500" />
    </div>
  );

  const statut = data?.data.statut || "";
  let statusClass = "text-gray-600";
  let statusText = `Status : ${statut}`;

  switch (statut) {
    case "Acceptée":
      statusClass = "text-success font-bold";
      break;
    case "Refusée":
      statusClass = "text-error font-bold";
      break;
    case "En attente":
      statusClass = "text-warning font-bold";
      break;
    default:
      statusClass = "text-gray-600 font-bold";
  }

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
        <span className="loading loading-dots loading-xl text-sky-500"></span>
      </div>
    );
  if (error) {
    return (
      <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
        <p className="text-error font-semibold text-lg">
          {error.info.message || "Erreur lors du chargement des données"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-white rounded-xl shadow-lg p-4 lg:p-9 animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-4">
      <a
        className="flex justify-start items-center gap-2 font-medium text-sky-600 hover:cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft size={20} />
        Retour
      </a>

      <div className="flex flex-col gap-6 grow justify-center p-6 border border-gray-100 shadow-sm rounded-xl">
        {/* Info Candidat */}
        <div className="flex items-center gap-4 ">
          {profileImage}
          <div>
            <p className="font-bold text-xl text-gray-900">
              {data?.data.nom || ""}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Candidature pour : <span className="font-semibold">{titre}</span>{" "}
              <br /> Profil postulé :{" "}
              <span className="font-semibold">
                {data?.data.profilPostule || "N/A"}
              </span>
            </p>
          </div>
        </div>

        <hr className="text-gray-200" />

        {/* AJOUT: Affichage du message d'action */}
        {actionMessage && (
          <div className="text-center">
            <p
              className={`text-xs ${
                isError ? "text-error" : "text-success"
              } font-medium`}
            >
              {actionMessage}
            </p>
          </div>
        )}

        {/* Boutons de fichiers */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            // Le lien href pointe maintenant vers la route Express sécurisée
            href={cvId ? cvLinkSecure : "#"}
            target="_blank"
            // S'assurer que le clic n'a pas d'effet si pas de CV
            onClick={(e) => !cvId && e.preventDefault()}
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-sky-500 text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-sky-600 hover:shadow-lg disabled:opacity-50"
            disabled={!data?.data.cv_path || loading}
          >
            <FileUser color="white" size={20} />
            Voir le CV
          </a>
          <a
            // Le lien href pointe maintenant vers la route Express sécurisée
            href={lmId ? lmLinkSecure : "#"}
            target="_blank"
            // S'assurer que le clic n'a pas d'effet si pas de CV
            onClick={(e) => !cvId && e.preventDefault()}
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-sky-500 text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-sky-600 hover:shadow-lg disabled:opacity-50"
            disabled={!data?.data.lm_path || loading}
          >
            <FileText color="white" size={20} />
            Voir la lettre de motivation
          </a>
        </div>

        {/* Boutons d'Action  */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleUpdateStatus("Acceptée")}
            className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-success text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-green-600 hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            <Check color="white" size={20} />
            Accepter
          </button>
          <button
            onClick={() => handleUpdateStatus("Refusée")}
            className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-red-500 text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-red-600 hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            <X color="white" size={20} />
            Refuser
          </button>
          <button
            onClick={() => handleUpdateStatus("En attente")}
            className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-warning text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-yellow-600 hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            <Clock color="white" size={20} />
            Mettre en attente
          </button>
        </div>

        {/*Statut */}
        <div className=" text-center">
          <p className={`text-md ${statusClass}`}>{statusText}</p>
        </div>
      </div>
    </div>
  );
}