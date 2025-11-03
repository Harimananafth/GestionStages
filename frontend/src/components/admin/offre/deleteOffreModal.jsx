import { useState } from "react"
import toast from 'react-hot-toast'; 

/**
 * Modal de confirmation pour la suppression d'une offre de stage.
 * @param {object} props - Les props du composant.
 * @param {string | null} props.offreId - L'ID de l'offre à supprimer.
 * @param {function} props.mutate - Fonction SWR pour rafraîchir les données dans le composant parent.
 */
export default function DeleteOffreModal({ offreId, mutate }) {
    const ApiUrl = import.meta.env.PROD
      ? import.meta.env.VITE_PROD_API_URL
      : import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false)

    const closeModal = () => {
        document.getElementById('deleteOffre').close();
    };

    const handleDelete = async (e) => {
        e.preventDefault()
        if (!offreId) {
            toast.error("Aucune offre sélectionnée pour la suppression.");
            return;
        }

        setLoading(true)

        try {
            const response = await fetch(`${ApiUrl}/offre/${offreId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Important pour inclure le cookie
            })

            const resData = await response.json();

            if (!response.ok) {
                // Gestion des erreurs du serveur (ex: offre non trouvée)
                throw new Error(resData.message || "Échec de la suppression côté serveur.");
            }

            // Succès
            toast.success(resData.message || "L'offre a été supprimée avec succès ! 🎉");
            
            // Rafraîchir la liste SWR dans le composant parent
            if (mutate) {
                mutate();
            }
            
            closeModal();

        } catch (err) {
            console.error("Erreur de suppression:", err);
            // Affichage de l'erreur
            toast.error(err.message || "Erreur lors de la suppression, veuillez réessayer.");
        } finally {
            setLoading(false)
        }
    }

    return (
        <dialog id="deleteOffre" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-white">
                <form method="dialog">
                    {/* Bouton pour fermer le modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                
                <h3 className="font-bold text-xl text-error">Suppression d'une offre</h3>
                <p className="py-4 text-gray-700">
                    Êtes-vous certain(e) de vouloir supprimer définitivement cette offre (ID: {offreId || 'N/A'}) ? 
                    Cette action est <strong>irréversible</strong> et toutes les candidatures associées pourraient être affectées.
                </p>

                <div className="flex items-center justify-end gap-3 mt-5">
                    {/* Bouton Annuler/Fermer */}
                    <button 
                        className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                        disabled={loading}
                        onClick={closeModal} 
                    >
                        Annuler
                    </button>

                    {/* Bouton Supprimer */}
                    <button 
                        className="btn btn-error text-white"
                        disabled={loading}
                        onClick={handleDelete}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm text-white"></span>
                        ) : "Supprimer"}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>fermer</button>
            </form>
        </dialog>
    )
}