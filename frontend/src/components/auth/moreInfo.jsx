import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";

export default function MoreInfo() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [num, setNum] = useState("")
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  // Pré-remplissage depuis name
  let prenomGoogle = "";
  let nomGoogle = "";
  if (user?.name) {
    const parts = user.name.trim().split(" ");
    prenomGoogle = parts.slice(0, -1).join(" ") || parts[0];
    nomGoogle = parts.slice(-1).join(" ");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const formData = new FormData(e.target);

      const payload = {
        nom: formData.get("nom"),
        prenom: formData.get("prenom"),
        ecole: formData.get("ecole"),
        diplome: formData.get("diplome"),
        niveau: formData.get("niveau") || "",
        specialite: formData.get("spec"),
        telephone: num,
        adresse: formData.get("adresse"),
        UtilisateurId: user?.id,
      };

      const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

      const response = await fetch(`${ApiUrl}/etudiant/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Votre profil étudiant a été créé avec succès !" });
        setTimeout(() => navigate("/t/"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Une erreur est survenue." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Erreur réseau. Réessayez plus tard." });
    } finally {
      setLoading(false);
    }
  };

  const getMessageClass = (type) => {
    switch (type) {
      case "success":
        return "text-success";
      case "error":
        return "text-error";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center py-14 px-5">
      <div className="flex flex-col gap-4 animate-[text-appear-bottom_0.5s_ease-in] bg-white shadow-lg rounded-2xl p-8 w-[400px] md:w-[800px] box-content">
        <h1 className="montserrat-hero font-bold text-xl">
          Dites-nous un peu plus sur vous
        </h1>
        {message && (
          <p className={`label text-xs text-center ${getMessageClass(message.type)}`}>
            {message.text}
          </p>
        )}
        <form className="flex flex-col md:flex-row md:gap-5 items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col md:w-1/2 w-full">
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Nom :</legend>
              <input
                type="text"
                name="nom"
                defaultValue={nomGoogle || ""}
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                placeholder="Neovate"
                required
              />
            </fieldset>
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Prénom(s) :</legend>
              <input
                type="text"
                name="prenom"
                defaultValue={prenomGoogle || ""}
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                placeholder="Mes Prénoms"
                required
              />
            </fieldset>
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Etablissement scolaire / universitaire :</legend>
              <input
                type="text"
                name="ecole"
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                placeholder="ENI Fianarantsoa"
                required
              />
            </fieldset>
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Niveau d'étude et diplôme :</legend>
              <div className="flex justify-between items-center gap-2.5">
                <input
                  type="text"
                  name="diplome"
                  className="input text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                  placeholder="Baccalauréat"
                  required
                />
                <select
                  name="niveau"
                  defaultValue=""
                  className="select text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                  required
                >
                  <option value="" disabled>Choisir un niveau</option>
                  <option>L1</option>
                  <option>L2</option>
                  <option>L3</option>
                  <option>M1</option>
                  <option>M2</option>
                </select>
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col md:w-1/2 w-full">
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Spécialité :</legend>
              <input
                type="text"
                name="spec"
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                placeholder="Développeur web fullstack"
                required
              />
            </fieldset>
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Numéro de téléphone :</legend>
                <IMaskInput
                  mask="03# ## ### ##"
                  definitions={{
                    "#": /[0-9]/,
                  }}
                  className="input min-w-full text-[0.85rem] text-[#4F5D75] border border-gray-200 focus:border-sky-400 rounded-lg focus:outline-none duration-300"
                  placeholder="03x xx xxx xx"
                  name="num"
                  value={num}
                  onAccept={(value) => setNum(value)} 
                  inputMode="numeric"
                />
            </fieldset>
            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Adresse postale :</legend>
              <input
                type="text"
                name="adresse"
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                placeholder="lot 123 adresse ville"
                required
              />
            </fieldset>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-7 hover:bg-sky-700 bg-sky-600 text-white h-12 rounded-lg text-md font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer"
            >
              {loading ? <span className="loading loading-spinner loading-md text-white"></span> : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
