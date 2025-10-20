import { useState } from "react";

export default function CreatePeriodeModal() {
  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");

  const todayStr = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD

  const validateDates = (d1, d2) => {
    if (!d1 || !d2) return null;

    const dateDebut = new Date(d1);
    const dateFin = new Date(d2);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateDebut < today) return "La date de début ne peut pas être antérieure à aujourd'hui.";
    if (dateFin <= today) return "La date de fin doit être postérieure à aujourd'hui.";
    if (dateFin <= dateDebut) return "La date de fin doit être postérieure à la date de début.";

    const oneMonthLater = new Date(dateDebut);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    if (dateFin < oneMonthLater) return "L'écart entre les deux dates doit être d'au moins un mois.";

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "debut") setDebut(value);
    if (name === "fin") setFin(value);

    // Validation instantanée
    const err = validateDates(
      name === "debut" ? value : debut,
      name === "fin" ? value : fin
    );
    setError(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const err = validateDates(debut, fin);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${ApiUrl}/periode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date_debut: debut,
          date_fin: fin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Période créée avec succès !");
        setError(null);
        setTimeout(() => {
          e.target.reset();
          const modal = document.getElementById("createPeriode");
          if (modal) modal.close();
          window.location.reload();
        }, 1000);
      } else {
        setError(data.message || "Erreur lors de la création.");
      }
    } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="createPeriode" className="modal">
      <div className="modal-box min-w-2xs bg-white p-8 rounded-2xl shadow-lg my-5 lg:my-0">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
        <h1 className="montserrat-hero font-bold text-lg mb-6">
          Créer une nouvelle période de stage
        </h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="label text-xs text-error mb-2">{error}</p>}
          {success && <p className="label text-xs text-success mb-2">{success}</p>}

          <fieldset className="fieldset gap-0 w-full mb-3">
            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">
              Date de début :
            </legend>
            <input
              type="date"
              name="debut"
              value={debut}
              min={todayStr}
              onChange={handleChange}
              className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 rounded-lg focus:outline-none duration-300"
              required
            />
          </fieldset>

          <fieldset className="fieldset gap-0 w-full mb-3">
            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">
              Date de fin :
            </legend>
            <input
              type="date"
              name="fin"
              value={fin}
              min={debut || todayStr}
              onChange={handleChange}
              className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 rounded-lg focus:outline-none duration-300"
              required
            />
          </fieldset>

          <button
            type="submit"
            disabled={loading || !!error}
            className={`block w-full mt-2 h-10 rounded-lg text-sm font-medium shadow-md duration-300 ${
              error
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700 text-white hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md text-white"></span>
            ) : (
              "Ajouter la période"
            )}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
