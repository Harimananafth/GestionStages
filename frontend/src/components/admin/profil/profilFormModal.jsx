import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProfilFormModal({ profil, mutate, apiUrl }) {
    const isEditing = !!profil; 
    const modalId = 'profil_form_modal';
    
    const [nomProfil, setNomProfil] = useState('');
    const [descriptionProfil, setDescriptionProfil] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Synchroniser les états locaux avec la prop 'profil' lors de l'édition
    useEffect(() => {
        if (isEditing) {
            setNomProfil(profil.nomProfil || '');
            setDescriptionProfil(profil.descriptionProfil || '');
        } else {
            setNomProfil('');
            setDescriptionProfil('');
        }
        setMessage(null);
        setIsError(false);
    }, [profil, isEditing]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${apiUrl}/${profil.id}` : apiUrl;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    nomProfil, 
                    descriptionProfil 
                }),
            });

            const result = await res.json();

            if (res.ok) {
                setIsError(false);
                setMessage(`Profil ${isEditing ? 'modifié' : 'ajouté'} avec succès !`);
                mutate(); 
                if (!isEditing) {
                    // Réinitialiser le formulaire après un ajout réussi
                    setNomProfil('');
                    setDescriptionProfil('');
                }
                // Fermer le message après un court délai
                setTimeout(() => setMessage(null), 2000); 

            } else {
                // Erreur côté serveur (4xx, 5xx)
                setIsError(true);
                const errorMessage = result.message || `Erreur ${res.status} lors de l'opération.`;
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

    // Fonction pour fermer la modal et réinitialiser les messages
    const handleClose = () => {
        document.getElementById(modalId).close();
        setMessage(null);
        setIsError(false);
    }


    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-xl p-8 rounded-2xl relative">
                
                {/* Bouton de fermeture (X) */}
                <button 
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                    onClick={handleClose}
                    aria-label="Fermer"
                >
                    <X size={20} />
                </button>

                <h3 className="montserrat-hero font-bold text-xl mb-3">
                    {isEditing ? 'Modifier le Profil' : 'Ajouter un nouveau Profil'}
                </h3>
                
                {/* Message de statut */}
                {message && (
                    <p className={`rounded-lg text-xs ${isError ? 'text-error' : 'text-success'}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nom du Profil */}
                    <fieldset className="fieldset gap-0 w-full ">
                            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Nom du Profil :</legend>
                            <input 
                                type="text"
                                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" 
                                placeholder="Ex: Développeur ReactJs"
                                value={nomProfil}
                                onChange={(e) => setNomProfil(e.target.value)}
                                required
                                disabled={loading}
                            />
                    </fieldset>

                    {/* Description du Profil */}
                    <fieldset className="fieldset gap-0 w-full ">
                        <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Description :</legend>
                        <textarea
                            className="textarea h-24 w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" 
                            placeholder="Décrivez brièvement le rôle..."
                            value={descriptionProfil}
                            onChange={(e) => setDescriptionProfil(e.target.value)}
                            required
                            disabled={loading}
                        ></textarea>
                    </fieldset>

                    <div className="modal-action mt-6">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={`px-4 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer whitespace-nowrap bg-sky-500 hover:bg-sky-600 text-white ${loading ? 'opacity-70' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : isEditing ? 'Sauvegarder les modifications' : 'Ajouter le profil'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Click en dehors de la modal pour fermer */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>fermer</button>
            </form>
        </dialog>
    );
}