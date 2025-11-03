import { useState } from 'react';
// Assurez-vous d'avoir installé react-hot-toast : npm install react-hot-toast
import toast from 'react-hot-toast'; 

// Fetcher qui inclut les cookies
const fetcher = (...args) => fetch(...args, { credentials: 'include' }).then(res => res.json())

export default function DeleteEtudiantModal({ etudiantId, mutate }) {
  const [isLoading, setIsLoading] = useState(false);
  const ApiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_API_URL;

  const closeModal = () => {
    // Utilisez la référence directe au modal (id) pour le fermer
    document.getElementById('deleteEtudiant').close();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!etudiantId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/etudiant/${etudiantId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      const res = await response.json();

      if (!response.ok) {
        // Le message d'erreur est renvoyé par le controller si l'ID n'existe pas ou erreur serveur
        throw new Error(res.message || "Échec de la suppression.");
      }

      // Succès : affichage du message et rafraîchissement de la liste
      toast.success(res.message || "Étudiant supprimé avec succès !");
      mutate(); 
      closeModal();

    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.message || "Échec de la suppression. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog id="deleteEtudiant" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white">
        <form method="dialog">
          {/* Bouton de fermeture standard */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-xl text-error">Confirmation de suppression</h3>
        <p className="py-4">
          Êtes-vous certain(e) de vouloir supprimer cet étudiant (ID: {etudiantId || 'N/A'}) ? Cette action est irréversible.
        </p>

        <div className="modal-action mt-5">
          <button 
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={closeModal} 
            disabled={isLoading}
          >
            Annuler
          </button>
          
          <button
            className="btn btn-error text-white"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm text-white"></span>
            ) : "Supprimer définitivement"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>fermer</button>
      </form>
    </dialog>
  );
}