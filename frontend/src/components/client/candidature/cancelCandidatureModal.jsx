import { useState } from 'react';
import toast from 'react-hot-toast'; // Assurez-vous d'avoir react-hot-toast
import { AlertTriangle } from 'lucide-react';

export default function CancelCandidatureModal({ candidature, mutate, apiUrl }) {
    const modalId = 'cancel_candidature_modal';
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        if (!candidature) return;

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/${candidature.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Échec de l'annulation.");
            }

            toast.success(result.message || "Candidature annulée avec succès.");
            mutate(); // Rafraîchit la liste SWR
            document.getElementById(modalId).close();

        } catch (error) {
            console.error("Erreur d'annulation:", error);
            toast.error(error.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box p-6">
                <h3 className="font-bold text-xl text-error flex items-center gap-2">Annuler la candidature
                </h3>
                <div className="py-4">
                    <p className="text-gray-700">
                        Êtes-vous sûr de vouloir annuler votre candidature pour le profil :  
                        <strong className="text-gray-900">
                            {" " + candidature?.Profil?.nomProfil || "N/A"} 
                        </strong> ?
                        Cette action est irréversible.
                    </p>
                </div>

                <div className="modal-action">
                    <form method="dialog">
                        <button 
                            className="btn btn-ghost"
                            disabled={loading}
                        >
                            Non, garder
                        </button>
                    </form>
                    <button
                        className={`btn btn-error text-white ${loading ? 'opacity-70' : ''}`}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : 'Oui, annuler'}
                    </button>
                </div>
            </div>
            {/* Click en dehors de la modal pour fermer */}
            <form method="dialog" className="modal-backdrop">
                <button>fermer</button>
            </form>
        </dialog>
    );
}