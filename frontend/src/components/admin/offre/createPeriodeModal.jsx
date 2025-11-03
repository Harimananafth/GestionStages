import { useState } from "react";

export default function CreatePeriodeModal() {
    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const debut = formData.get("debut");
        const fin = formData.get("fin");

        const dateDebut = new Date(debut);
        const dateFin = new Date(fin);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // Date de début < aujourd’hui ?
        if (dateDebut < today) {
            setError("La date de début ne peut pas être antérieure à aujourd'hui.");
            setLoading(false);
            return;
        }

        //  Date de fin <= aujourd’hui ?
        if (dateFin <= today) {
            setError("La date de fin doit être postérieure à aujourd'hui.");
            setLoading(false);
            return;
        }

        // La date de fin est avant la date de début ?
        if (dateFin <= dateDebut) {
            setError("La date de fin doit être postérieure à la date de début.");
            setLoading(false);
            return;
        }

        // L'écart minimum est de 1 mois
        const oneMonthLater = new Date(dateDebut);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        if (dateFin < oneMonthLater) {
            setError("L'écart entre la date de début et la date de fin doit être d'au moins un mois.");
            setLoading(false);
            return;
        }

        // --- ENVOI AU SERVEUR ---
        try {
            const response = await fetch(`${ApiUrl}/periode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    date_debut: debut,
                    date_fin: fin
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || "Période créée avec succès !");
                setError(null);

                // Fermeture du modal après un délai
                setTimeout(() => {
                    e.target.reset();
                    const modal = document.getElementById('createPeriode');
                    if (modal) modal.close();
                    window.location.reload()
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
                            className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 rounded-lg focus:outline-none duration-300"
                            required
                        />
                    </fieldset>

                    <button
                        type="submit"
                        disabled={loading}
                        className="block w-full mt-2 hover:bg-sky-700 bg-sky-600 text-white h-10 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg"
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
