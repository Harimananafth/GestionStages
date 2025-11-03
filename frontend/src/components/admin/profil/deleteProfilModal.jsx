import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';

export default function DeleteProfilModal({ profilId, mutate, apiUrl }) {
    const modalId = 'delete_profil_modal';
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Réinitialiser le message lorsque l'ID change
    useEffect(() => {
        setMessage(null);
        setIsError(false);
    }, [profilId]);

    const handleDelete = async () => {
        if (!profilId) return;

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${apiUrl}/${profilId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await res.json();

            if (res.ok) {
                setIsError(false);
                setMessage(`Profil (ID: ${profilId}) supprimé avec succès.`);
                mutate(); // Revalider les données SWR pour mettre à jour la liste
                // Laissez le message s'afficher quelques secondes avant de fermer
                setTimeout(() => {
                    document.getElementById(modalId).close();
                }, 1500);
            } else {
                // Erreur côté serveur
                setIsError(true);
                const errorMessage = result.message || `Erreur ${res.status} lors de la suppression.`;
                setMessage(errorMessage);
            }
        } catch (err) {
            // Erreur réseau
            setIsError(true);
            setMessage("Erreur réseau ou problème de connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box p-8 rounded-2xl">
                <h3 className="font-bold text-xl text-error flex items-center gap-2">
                    Confirmation de suppression
                </h3>
                <div className="py-4">
                    {message ? (
                        <p className={`text-xs font-semibold ${isError ? 'text-error' : 'text-success'}`}>{message}</p>
                    ) : (
                        <p className="text-gray-700">
                            Êtes-vous sûr de vouloir supprimer ce profil (ID: {profilId}) ? Cette action est <strong>irréversible</strong>.
                        </p>
                    )}
                </div>

                <div className="modal-action">
                    <form method="dialog">
                        <button 
                            className="btn btn-ghost"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                    </form>
                    <button
                        className={`btn bg-error text-white hover:bg-red-700 ${loading ? 'opacity-70' : ''}`}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : 'Supprimer définitivement'}
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