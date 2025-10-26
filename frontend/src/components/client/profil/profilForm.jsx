import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Loader2, AlertCircle, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { IMaskInput } from "react-imask";


// --- Imports pour le recadrage (Crop) ---
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "../../../utils/canvasPreview";

// URL de l'API
const ApiUrl =
  import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

// --- Fetcher SWR  ---
const fetcher = (...args) =>
  fetch(args[0], { credentials: "include" }).then((res) => {
    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }
    return res.json();
  });

// --- API Call pour Mettre à jour ETUDIANT (données textuelles) ---
const updateEtudiantApi = async (etudiantId, updatedData) => {
  const res = await fetch(`${ApiUrl}/etudiant/${etudiantId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    credentials : "include"
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// --- API Call pour Mettre à jour UTILISATEUR (photo) ---
const updateUserPhotoApi = async (userId, formData) => {
  const res = await fetch(`${ApiUrl}/utilisateur/${userId}`, {
    method: "PUT",
    body: formData,
    credentials: "include", 
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// ----------------------------------------------------------------------
// --- Composants Enfants ---
// ----------------------------------------------------------------------

const FormField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder = "",
}) => (
  <fieldset className="fieldset gap-0 w-full">
    <legend className="fieldset-legend font-medium text-sm text-[#4F5D75]">
      {label} :
    </legend>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-300 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300 p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
      placeholder={placeholder}
      required
    />
  </fieldset>
);

const FormSelect = ({ label, name, value, onChange, disabled, children }) => (
  <fieldset className="fieldset gap-0 w-full">
    <legend className="fieldset-legend font-medium text-sm text-[#4F5D75]">
      {label} :
    </legend>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className="select w-full text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300 disabled:cursor-not-allowed"
    >
      {children}
    </select>
  </fieldset>
);

// ----------------------------------------------------------------------
// --- Composant Principal : ProfilForm ---
// ----------------------------------------------------------------------

export default function ProfilForm() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [utilisateur, setUtilisateur] = useState(null);

  // --- États pour le Modal et le Crop ---
  const [modalOpen, setModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Récupérer l'utilisateur du localStorage
  useEffect(() => {
    document.title = "Profil"
    const storedUser = localStorage.getItem("utilisateur");
    if (storedUser) {
      setUtilisateur(JSON.parse(storedUser));
    } else {
      console.error("Utilisateur non trouvé dans le localStorage");
    }
  }, []);

  const utilisateurId = utilisateur?.id;
  const apiUrl = utilisateurId ? `${ApiUrl}/etudiant/${utilisateurId}` : null;

  // 2. Fetcher les données de l'étudiant
  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher);
  const etudiantData = data?.data;

  // 3. Mettre à jour l'état du formulaire
  useEffect(() => {
    if (etudiantData) {
      setFormData({
        // Données de l'Utilisateur (non-modifiables ici, sauf nom/prénom)
        email: utilisateur?.email || "",
        // Données de l'Etudiant (modifiables)
        nom: etudiantData.nom,
        prenom: etudiantData.prenom,
        telephone: etudiantData.telephone,
        adresse: etudiantData.adresse,
        ecole: etudiantData.ecole,
        diplome: etudiantData.diplome,
        niveau: etudiantData.niveau,
        specialite: etudiantData.specialite,
      });
    }
  }, [etudiantData, utilisateur]);

  // Gère les changements dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gère l'annulation
  const handleCancel = () => {
    setIsEditing(false);
    // Réinitialise le formulaire
    if (etudiantData) {
      setFormData({
        email: utilisateur?.email || "",
        nom: etudiantData.nom,
        prenom: etudiantData.prenom,
        telephone: etudiantData.telephone,
        adresse: etudiantData.adresse,
        ecole: etudiantData.ecole,
        diplome: etudiantData.diplome,
        niveau: etudiantData.niveau,
        specialite: etudiantData.specialite,
      });
    }
  };

  // Gère la soumission du formulaire (Nom, Prénom, Tel, Adresse, etc.)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Exclut l'email (qui est sur le modèle Utilisateur)
    const { email, ...updateData } = formData;

    try {
      const result = await updateEtudiantApi(etudiantData.id, updateData);

      toast.success(result.message || "Profil mis à jour avec succès !");
      setIsEditing(false);
      mutate(); // Rafraîchit les données SWR
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Fonctions pour le CROP ---


  function onImageLoad(e) {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;

    // Si l'image est plus large que haute, basez le crop sur la hauteur (100% de la hauteur)
    const baseDimension = width > height ? "height" : "width";

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          [baseDimension]: 100, // Définit 100% de la dimension la plus petite
        },
        1, // Aspect ratio (carré)
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
    // Initialise également completedCrop pour avoir un premier rendu
    setCompletedCrop(crop);
  }

  // Gère la sélection du fichier
  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Réinitialise le crop
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setModalOpen(true);
    }
  }

  // Déclenche le clic sur l'input file caché
  const handleChangePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (completedCrop && previewCanvasRef.current && imgRef.current) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]); // Se déclenche quand le recadrage est finalisé

  // Gère la soumission de la NOUVELLE PHOTO
  const handlePhotoUpload = async () => {
    if (!completedCrop || !previewCanvasRef.current) {
      toast.error("Veuillez d'abord recadrer l'image.");
      return;
    }
    // S'assurer que le canvas n'est pas vide (bug de l'image noire)
    if (
      previewCanvasRef.current.width === 0 ||
      previewCanvasRef.current.height === 0
    ) {
      toast.error("Erreur lors de la préparation de l'image. Réessayez.");
      return;
    }

    setIsUploadingPhoto(true);

    previewCanvasRef.current.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Erreur lors de la création de l'image.");
          setIsUploadingPhoto(false);
          return;
        }

        const formData = new FormData();
        formData.append("photo", blob, "profile-photo.jpg");

        try {
          // Appelle la route /utilisateur/:id
          const result = await updateUserPhotoApi(utilisateur.id, formData);

          toast.success("Photo de profil mise à jour !");
          setModalOpen(false);
          setImgSrc("");

          // Mettre à jour le localStorage avec la nouvelle photo 
          const updatedUser = { ...utilisateur, photo: result.data.photo };
          localStorage.setItem("utilisateur", JSON.stringify(updatedUser));
          setUtilisateur(updatedUser); // Met à jour l'état local
        } catch (err) {
          console.error(err);
          toast.error(err.message || "Échec de l'upload.");
        } finally {
          setIsUploadingPhoto(false);
        }
      },
      "image/jpeg",
      0.9
    ); // Compression JPEG
  };

  // ----------------------------------------------------------------------
  // --- Rendu du composant ---
  // ----------------------------------------------------------------------

  // A. Gestion des états de chargement/erreur
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
        <Loader2 size={24} className="animate-spin text-sky-600" />
        <p className="ml-3 text-gray-700">Chargement du profil...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 bg-red-50 border border-red-300 text-red-700 rounded-lg p-4">
        <AlertCircle size={24} />
        <p className="mt-2 text-center">
          Erreur lors du chargement des données.
        </p>
      </div>
    );
  }
  if (!etudiantData) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          Aucune donnée étudiant trouvée pour cet utilisateur.
        </p>
      </div>
    );
  }

  // B. Données pour l'affichage
  const fullName = `${formData.nom || ""} ${formData.prenom || ""}`;
  let photoUrl = utilisateur?.photo;

  // C. Forcer le rechargement de l'image (Cache-Busting)
  if (photoUrl) {
    photoUrl = `${photoUrl.split("?")[0]}?v=${new Date().getTime()}`;
  }

  return (
    <div className="min-h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      {/* --- Input File Caché --- */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onSelectFile}
        className="hidden"
      />

      {/* --- Modal de Recadrage --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto overflow-hidden">
            {" "}
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Recadrer votre photo
            </h3>
            {imgSrc && (
              <div className="flex justify-center w-full max-h-[65vh] overflow-y-auto mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)} // Met à jour l'état final du crop
                  aspect={1} // Aspect 1:1 (carré)
                >
                  <img
                    ref={imgRef}
                    alt="Image à recadrer"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    // Style pour que l'image s'adapte sans dépasser
                    style={{ maxHeight: "60vh", maxWidth: "100%" }}
                  />
                </ReactCrop>
              </div>
            )}
            {/* Canvas caché pour générer l'image recadrée */}
            <canvas ref={previewCanvasRef} className="hidden" />
            <div className="mt-5 sm:mt-6 flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setModalOpen(false);
                  setImgSrc("");
                }}
                disabled={isUploadingPhoto}
              >
                Annuler
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2"
                onClick={handlePhotoUpload}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Valider la photo"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- En-tête de la page --- */}
      <a
        className="flex justify-start items-center gap-2 font-medium text-sky-600 hover:cursor-pointer w-fit mb-3"
        onClick={() => navigate(-1)}
      >
        <MoveLeft size={20} />
        Retour
      </a>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Profil</h1>

      {/* --- Bloc Profil (Photo & Nom) --- */}
      <div className="flex items-center gap-4 mb-5 p-4 border-b border-gray-200">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Photo de ${fullName}`}
            className="w-16 h-16 rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
            <User size={32} className="text-gray-500" />
          </div>
        )}
        <div>
          {/* Affiche le nom/prénom du formulaire (modifiable) */}
          <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
          <button
            type="button"
            onClick={handleChangePhotoClick}
            className="text-sm text-sky-600 hover:underline cursor-pointer"
          >
            Changer la photo
          </button>
        </div>
      </div>

      {/* --- Checkbox pour activer la modification --- */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="editToggle"
          className="toggle toggle-info"
          checked={isEditing}
          onChange={() => setIsEditing(!isEditing)}
        />
        <label
          htmlFor="editToggle"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {isEditing ? "Mode édition activé" : "Activer la modification"}
        </label>
      </div>

      {/* --- Formulaire --- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* --- Section: Informations personnelles --- */}
        <div>
          <h3 className="text-xl font-semibold text-sky-400 mb-3">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <FormField
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="RABEHARISON"
            />
            <FormField
              label="Prénom(s)"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Fitahiana Harimanana"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true} // Email non modifiable
              placeholder="contact@adresse.com"
            />
            <FormField
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="lot 123 adresse, ville"
            />
            {/* Numéro de téléphone avec IMask */}
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">
                Numéro de téléphone :
              </legend>
              <IMaskInput
                mask="03# ## ### ##"
                definitions={{
                  "#": /[0-9]/,
                }}
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border border-gray-200 focus:border-sky-400 rounded-lg focus:outline-none duration-300"
                placeholder="03x xx xxx xx"
                name="telephone"
                value={formData.telephone}
                onAccept={(value) => handleChange}
                disabled={!isEditing}
                inputMode="numeric"
              />
            </fieldset>
          </div>
        </div>

        {/* --- Section: Informations académiques --- */}
        <div>
          <h3 className="text-xl font-semibold text-sky-400 mb-3">
            Informations académiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <FormField
              label="École"
              name="ecole"
              value={formData.ecole}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="ENI Fianarantsoa"
            />
            <FormField
              label="Diplôme"
              name="diplome"
              value={formData.diplome}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Baccalauréat"
            />
            {/* Champ Niveau (Select) */}
            <FormSelect
              label="Niveau d'étude"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Sélectionner...</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="M1">M1</option>
              <option value="M2">M2</option>
            </FormSelect>
            <FormField
              label="Spécialité"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Développement web"
            />
          </div>
        </div>

        {/* --- Boutons d'action (conditionnels) --- */}
        {isEditing && (
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />{" "}
                  Enregistrement...
                </>
              ) : (
                "Mettre à jour"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
