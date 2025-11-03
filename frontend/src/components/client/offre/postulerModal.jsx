import { useState, useRef, useEffect } from "react";
import { X, CheckCircle, UploadCloud, Loader2 } from "lucide-react";
import useSWR from "swr";

const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;

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

// Classes de style communes pour les inputs
const customInputClass =
  "w-full text-[0.85rem] text-[#4F5D75] border border-gray-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-lg focus:outline-none duration-300 h-10 px-3 py-2";

// Composant de la Modal de Candidature
const PostulerModal = ({ offre, userId, onClose, onCandidatureSuccess }) => {
  // Les profils de l'offre (pour le select input)
  const profils = offre?.Profils || [];

  // État du formulaire
  const [selectedProfilId, setSelectedProfilId] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [lmFile, setLmFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [etudiantId, setEtudiantID] = useState(null);

  // 	Récupérer les infos de l'étudiant
  const {
    data: EtudiantInfo,
    error: getInfoError,
    isLoading: getInfoIsLoading,
  } = useSWR(`${API_URL}/etudiant/${userId}`, fetcher);

  useEffect(() => {
    if (EtudiantInfo && EtudiantInfo.data) setEtudiantID(EtudiantInfo.data.id);
  }, [EtudiantInfo]);

  // Références pour pouvoir "réinitialiser" les inputs de fichiers
  const cvInputRef = useRef(null);
  const lmInputRef = useRef(null);

  // Réinitialiser les états et fermer la modale
  const handleClose = () => {
    setSelectedProfilId("");
    setCvFile(null);
    setLmFile(null);
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
    // Réinitialiser les champs de fichiers
    if (cvInputRef.current) cvInputRef.current.value = "";
    if (lmInputRef.current) lmInputRef.current.value = "";
    onClose();
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Validation de base
    if (!etudiantId || !offre?.id || !selectedProfilId || !cvFile || !lmFile) {
      setError("Veuillez remplir tous les champs (profil, CV, LM).");
      return;
    }

    const formData = new FormData();
    // Les clés doivent correspondre à ce que le contrôleur attend
    formData.append("EtudiantId", etudiantId);
    formData.append("OffreId", offre.id);
    formData.append("ProfilId", selectedProfilId);
    // Les noms des fichiers (cv, lm) doivent correspondre au middleware `upload.fields`
    formData.append("cv", cvFile);
    formData.append("lm", lmFile);

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/candidature`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let data = {};
      try {
        data = await response.json();
        console.log(data);
      } catch (jsonError) {
        if (!response.ok) {
          throw new Error(
            "Le serveur a renvoyé une erreur inattendue. (Statut: " +
              response.status +
              ")"
          );
        }
      }

      if (!response.ok) {
        // Gérer les erreurs de validation ou serveur (400, 404, 500)
        throw new Error("Erreur lors de l'envoi de la candidature.");
      }

      setSuccess(true);
      // Informer le parent de la réussite pour potentiellement mettre à jour la liste
      onCandidatureSuccess(offre.id);
    } catch (err) {
      console.error("Erreur de candidature:", err);
      setError(err.message || "Une erreur inconnue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si l'offre n'est pas définie ou si l'API est manquante
  if (!offre) return null;

  return (
    // Utilisez `modal-open` pour afficher la modale via un état (géré par le parent)
    <dialog
      id="candidature_modal"
      className={`modal ${offre ? "modal-open" : ""}`}
      aria-modal="true"
    >
      <div className="modal-box p-8 bg-white shadow-lg rounded-2xl w-11/12 max-w-lg">
        {/* En-tête de la modale */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-sky-600">
            Postuler à : {offre.titre}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-sky-600"
            onClick={handleClose}
            aria-label="Fermer la fenêtre de candidature"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu de la modale */}
        {success ? (
          // État de succès
          <div className="text-center p-8 bg-green-50 rounded-xl">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-green-700">
              Candidature envoyée avec succès !
            </p>
            <p className="text-gray-600 mt-2">
              Vous serez notifié du statut de votre candidature.
            </p>
            <button
              className="btn btn-sm bg-sky-600 text-white hover:bg-sky-700 mt-6 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg"
              onClick={handleClose}
            >
              Fermer
            </button>
          </div>
        ) : (
          // Formulaire de candidature
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Message d'erreur */}
            {error && (
              <p className="text-error">
                Erreur lors de la soumission de la candidature
              </p>
            )}

            {/* Sélecteur de Profil (ProfilId) */}
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">
                Sélectionnez votre profil{" "}
                <span className="text-red-500">*</span>
              </legend>
              {/* Le select est stylisé comme un input text */}
              <select
                className="select select-bordered w-full lg:w-auto text-xs font-medium focus:border-sky-500 focus:outline-none h-10 px-3 py-2"
                value={selectedProfilId}
                onChange={(e) => {
                  setSelectedProfilId(e.target.value);
                }}
                required
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Choisissez un profil requis par l'offre
                </option>
                {profils.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nomProfil} ({p.OffreProfil?.nbProfil} stagiaire
                    {p.OffreProfil?.nbProfil > 1 ? "s" : ""})
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Input CV (cv_path) */}
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">
                Télécharger votre CV{" "}
                <span className="text-xs">(PDF, 5 Mo max)</span>{" "}
                <span className="text-red-500">*</span>
              </legend>
              <input
                ref={cvInputRef}
                type="file"
                accept="application/pdf"
                className={`${customInputClass} file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer`}
                onChange={(e) => setCvFile(e.target.files[0])}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Fichier sélectionné : {cvFile?.name || "Aucun"}
              </p>
            </fieldset>

            {/* Input Lettre de Motivation (lm_path) */}
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">
                Télécharger votre Lettre de Motivation{" "}
                <span className="text-xs">(PDF, 5 Mo max)</span>{" "}
                <span className="text-red-500">*</span>
              </legend>
              <input
                ref={lmInputRef}
                type="file"
                accept="application/pdf"
                className={`${customInputClass} file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer`}
                onChange={(e) => setLmFile(e.target.files[0])}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Fichier sélectionné : {lmFile?.name || "Aucun"}
              </p>
            </fieldset>

            {/* Bouton de soumission */}
            <div className="modal-action mt-6 p-0">
              <button
                type="submit"
                className="w-full hover:bg-sky-700 bg-sky-600 text-white h-10 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg disabled:bg-sky-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Envoi en
                    cours...
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} /> Confirmer la Candidature
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Fond sombre pour fermer au clic en dehors du formulaire (si non envoi) */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} disabled={isSubmitting}>
          Fermer
        </button>
      </form>
    </dialog>
  );
};

export default PostulerModal;
