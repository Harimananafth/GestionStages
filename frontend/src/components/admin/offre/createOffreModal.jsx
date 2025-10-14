import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

// Fonction pour formater les dates de manière lisible
const formatDateRange = (start, end) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const startDate = new Date(start).toLocaleDateString('fr-FR', options);
    const endDate = new Date(end).toLocaleDateString('fr-FR', options);
    return `${startDate} au ${endDate}`;
}

// Le composant principal du formulaire
export default function CreateOfferModal({ mutate }) {

    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
    
    const [loading, setLoading] = useState(false)


    // Récupération des données
    const { data: availablePeriodes, error: periodesError, isLoading: periodesLoading } = useSWR(`${ApiUrl}/periode`, fetcher);
    const { data: availableProfils, error: profilsError, isLoading: profilsLoading } = useSWR(`${ApiUrl}/profil`, fetcher);

    // États du formulaire 
    const [titre, setTitre] = useState('');
    const [periodeId, setPeriodeId] = useState('');
    const [profilsOffre, setProfilsOffre] = useState([]);

    // États pour le système d'ajout de profil 
    const [selectedProfilId, setSelectedProfilId] = useState('');
    const [nombreProfil, setNombreProfil] = useState(1);
    const [error, setError] = useState('');
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    // Gestionnaires d'événements 
    const handleAddProfil = () => {
        setError('');
        if (!selectedProfilId || !nombreProfil || nombreProfil < 1) {
            setError('Veuillez sélectionner un profil et un nombre valide.');
            return;
        }
        if (profilsOffre.some(p => p.profilId === parseInt(selectedProfilId))) {
            setError('Ce profil a déjà été ajouté à l\'offre.');
            return;
        }

        setProfilsOffre([...profilsOffre, { profilId: parseInt(selectedProfilId), nbProfil: parseInt(nombreProfil) }]);
        setSelectedProfilId('');
        setNombreProfil(1);
    };

    const handleRemoveProfil = (idToRemove) => {
        setProfilsOffre(profilsOffre.filter(p => p.profilId !== idToRemove));
    };
    
    const resetForm = () => {
        setTitre('');
        setPeriodeId('');
        setProfilsOffre([]);
        setSelectedProfilId('');
        setNombreProfil(1);
        setError('');
        setFormMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        // Vérifications de base
        if (!titre || !periodeId || profilsOffre.length === 0) {
            setFormMessage({ type: 'error', text: 'Veuillez remplir tous les champs et ajouter au moins un profil.' });
            return;
        }

        // Données pour créer l'offre
        const offreData = {
            titre,
            PeriodeId: parseInt(periodeId)
        };

        try {
            
            const resOffre = await fetch(`${ApiUrl}/offre`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(offreData)
            });

            const offreResult = await resOffre.json();
            if (!resOffre.ok) {
                throw new Error(offreResult.message || "Erreur lors de la création de l'offre");
            }

            const offreId = offreResult.data.id;
            console.log(' Offre créée avec ID :', offreId);

            
            for (const profil of profilsOffre) {
                const assignData = {
                    OffreId: offreId,
                    ProfilId: profil.profilId,
                    nbProfil: profil.nbProfil
                };

                const resProfil = await fetch(`${ApiUrl}/offreProfil`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(assignData)
                });

                const profilResult = await resProfil.json();
                if (!resProfil.ok) {
                    console.error(' Erreur assignation profil:', profilResult);
                    throw new Error(`Erreur lors de l'assignation du profil ${profil.profilId}`);
                }

                console.log(` Profil ${profil.profilId} assigné à l’offre.`);
            }

            if (mutate) mutate()
            
            setFormMessage({ type: 'success', text: "L'offre a été créée et les profils ont été attribués avec succès !" });

            setTimeout(() => {
                resetForm();
                if (document.getElementById('createOffre')) {
                    document.getElementById('createOffre').close();
                }
            }, 1000);

        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            setFormMessage({ type: 'error', text: error.message || "Une erreur est survenue lors de la création de l'offre." });
        }finally {
            setLoading(false);
        } 
    };

    
    const getProfilNameById = (id) => {
        return availableProfils?.data?.find(p => p.id === id)?.nomProfil || 'Inconnu';
    }
    
    const renderLoadingOrError = () => {
        if (periodesLoading || profilsLoading) {
            return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;
        }
        if (periodesError || profilsError) {
            return <div role="alert" className="alert alert-error"><span>Erreur de chargement des données. Veuillez rafraîchir la page.</span></div>;
        }
        return null;
    }

    // Styles des inputs et légendes
    const inputStyle = "input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300";
    const legendStyle = "fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]";
    const fieldsetStyle = "fieldset gap-0 w-full";

    return (
        <dialog id="createOffre" className="modal">
            <div className="modal-box md:max-w-4xl bg-white p-8 rounded-2xl shadow-lg my-5 lg:my-0">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                </form>
                <h1 className="montserrat-hero font-bold text-2xl mb-6">Créer une nouvelle offre</h1>
                
                {renderLoadingOrError() || (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {/* Colonne de gauche */}
                            <div className="flex flex-col space-y-4">
                                <fieldset className={fieldsetStyle}>
                                    <legend className={legendStyle}>Titre de l'offre :</legend>
                                    <input type="text" id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} className={inputStyle} placeholder="Ex: Développeur React Senior" required />
                                </fieldset>
                                <fieldset className={fieldsetStyle}>
                                    <legend className={legendStyle}>Période de l'offre :</legend>
                                    <select id="periode" value={periodeId} onChange={(e) => setPeriodeId(e.target.value)} className={inputStyle + " select"} required>
                                        <option value="" disabled>Choisir une période</option>
                                        {Array.isArray(availablePeriodes?.data) ? (
                                        availablePeriodes.data.map((periode) => (
                                            <option key={periode.id} value={periode.id}>
                                            {formatDateRange(periode.date_debut, periode.date_fin)}
                                            </option>
                                        ))
                                        ) : (
                                        <option disabled>Aucune période disponible</option>
                                        )}
                                    </select>
                                </fieldset>
                                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Ajouter des profils</h2>
                                    <div className="flex flex-col items-start  gap-2">
                                        <select value={selectedProfilId} onChange={(e) => setSelectedProfilId(e.target.value)} className={inputStyle + " select"}>
                                            <option value="" disabled>-- Choisir un profil --</option>
                                            {Array.isArray(availableProfils?.data) ? (
                                            availableProfils.data.map((profil) => (
                                                <option key={profil.id} value={profil.id}>
                                                {profil.nomProfil}
                                                </option>
                                            ))
                                            ) : (
                                            <option disabled>Aucun profil disponible</option>
                                            )}
                                        </select>
                                        <input type="number" value={nombreProfil} onChange={(e) => setNombreProfil(e.target.value ? parseInt(e.target.value) : '')} min="1" className={`${inputStyle} w-full sm:w-24`} />
                                        <button type="button" onClick={handleAddProfil} className="w-full h-7 px-4 rounded-lg text-xs font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer whitespace-nowrap bg-sky-500 hover:bg-sky-600 text-white">
                                            Ajouter
                                        </button>
                                    </div>
                                    {error && <p className="text-error text-sm">{error}</p>}
                                </div>
                            </div>
                            
                            {/* Colonne de droite */}
                            <div className="flex flex-col space-y-4">
                                <div className="space-y-2">
                                    <h3 className={`${legendStyle}`}>Profils pour cette offre :</h3>
                                    {profilsOffre.length > 0 ? (
                                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 border border-gray-100 rounded-lg p-2">
                                        {profilsOffre.map(profil => (
                                            <div key={profil.profilId} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                                <span>{getProfilNameById(profil.profilId)} <span className="text-gray-500">({profil.nbProfil})</span></span>
                                                <button type="button" onClick={() => handleRemoveProfil(profil.profilId)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Retirer</button>
                                            </div>
                                        ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 bg-gray-50 p-3 rounded-lg border">Aucun profil ajouté.</p>
                                    )}
                                </div>
                                {formMessage.text && (
                                    <p className={`text-${formMessage.type === 'success' ? 'success' : 'error'} text-sm`}>{formMessage.text}</p>
                                )}

                                <div className="modal-action mt-6">
                                    <button 
                                        type="submit" 
                                        disabled={loading}  
                                        className="w-full h-10 px-6 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white"
                                        >
                                            {loading ? (
                                                <span className="loading loading-spinner loading-md text-white "></span>
                                                ) : "Créer l'offre"
                                            }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={resetForm}>close</button>
            </form>
        </dialog>
    );
}

