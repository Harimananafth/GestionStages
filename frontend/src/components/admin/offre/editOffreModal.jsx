import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url, { credentials: 'include' }).then((res) => res.json());

const formatDateRange = (start, end) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return `${new Date(start).toLocaleDateString('fr-FR', options)} au ${new Date(end).toLocaleDateString('fr-FR', options)}`;
};

export default function EditOfferModal({ offreId, mutate }) {
  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false)


  const { data: availablePeriodes, error: periodesError, isLoading: periodesLoading } = useSWR(`${ApiUrl}/periode`, fetcher);
  const { data: availableProfils, error: profilsError, isLoading: profilsLoading } = useSWR(`${ApiUrl}/profil`, fetcher);
  const { data: offreData, error: offreError, isLoading: offreLoading, mutate: refetchOffre } = useSWR(
    offreId ? `${ApiUrl}/offre/${offreId}` : null,
    fetcher
  );

  const [titre, setTitre] = useState('');
  const [periodeId, setPeriodeId] = useState('');
  const [profilsOffre, setProfilsOffre] = useState([]);
  const [selectedProfilId, setSelectedProfilId] = useState('');
  const [nombreProfil, setNombreProfil] = useState(1);
  const [error, setError] = useState('');
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Charger les données de l'offre au montage
  useEffect(() => {
    if (offreData?.offre) {
      const o = offreData.offre;
      setTitre(o.titre || '');
      setPeriodeId(o.Periode?.id || '');
      const profils = Array.isArray(o.Profils)
        ? o.Profils.map((p) => ({
            profilId: p.id,
            nbProfil: p.OffreProfil?.nbProfil || 1,
          }))
        : [];
      setProfilsOffre(profils);
    }
  }, [offreData]);

  const handleAddProfil = () => {
    setError('');
    if (!selectedProfilId || !nombreProfil || nombreProfil < 1) {
      setError('Veuillez sélectionner un profil et un nombre valide.');
      return;
    }
    if (profilsOffre.some((p) => p.profilId === parseInt(selectedProfilId))) {
      setError('Ce profil a déjà été ajouté.');
      return;
    }
    setProfilsOffre([...profilsOffre, { profilId: parseInt(selectedProfilId), nbProfil: parseInt(nombreProfil) }]);
    setSelectedProfilId('');
    setNombreProfil(1);
  };

  const handleRemoveProfil = (idToRemove) => {
    setProfilsOffre(profilsOffre.filter((p) => p.profilId !== idToRemove));
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
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    if (!titre || !periodeId || profilsOffre.length === 0) {
      setFormMessage({ type: 'error', text: 'Veuillez remplir tous les champs et ajouter au moins un profil.' });
      return;
    }

    try {
      // Mettre à jour l'offre
      const resOffre = await fetch(`${ApiUrl}/offre/${offreId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titre,
          PeriodeId: parseInt(periodeId),
        }),
      });

      if (!resOffre.ok) {
        const result = await resOffre.json();
        throw new Error(result.message || 'Erreur de mise à jour de l’offre');
      }

      // Récupérer les profils existants pour comparaison
      const profilsExistantsRes = await fetch(`${ApiUrl}/offreProfil/${offreId}`, { credentials: 'include' });
      const profilsExistants = (await profilsExistantsRes.json())?.data || [];

      const existantsIds = profilsExistants.map((p) => p.ProfilId);
      const nouveauxIds = profilsOffre.map((p) => p.profilId);

      // Profils à ajouter
      const toAdd = profilsOffre.filter((p) => !existantsIds.includes(p.profilId));
      // Profils à supprimer
      const toDelete = existantsIds.filter((id) => !nouveauxIds.includes(id));
      // Profils à mettre à jour
      const toUpdate = profilsOffre.filter((p) => existantsIds.includes(p.profilId));

      // Ajout des nouveaux
      for (const profil of toAdd) {
        await fetch(`${ApiUrl}/offreProfil`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            OffreId: offreId,
            ProfilId: profil.profilId,
            nbProfil: profil.nbProfil,
          }),
        });
      }

      // Mise à jour des profils existants
      for (const profil of toUpdate) {
        await fetch(`${ApiUrl}/offreProfil/${offreId}/${profil.profilId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ nbProfil: profil.nbProfil }),
        });
      }

      // Suppression des anciens profils retirés
      for (const id of toDelete) {
        await fetch(`${ApiUrl}/offreProfil/${offreId}/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      if (mutate) mutate();
      setFormMessage({ type: 'success', text: "L'offre a été mise à jour avec succès !" });

      setTimeout(() => {
        resetForm();
        document.getElementById('editOffre').close();
        window.location.reload()
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' });
    }finally {
      setLoading(false);
    } 
  };

  const getProfilNameById = (id) => availableProfils?.data?.find((p) => p.id === id)?.nomProfil || 'Inconnu';

  const renderLoadingOrError = () => {
    if (periodesLoading || profilsLoading || offreLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }
    if (periodesError || profilsError || offreError) {
      return (
        <div role="alert" className="alert alert-error">
          <span>Erreur de chargement. Rafraîchissez la page.</span>
        </div>
      );
    }
    return null;
  };

  const inputStyle =
    'input min-w-full text-[0.85rem] text-[#4F5D75] border border-gray-200 focus:border-sky-400 rounded-lg focus:outline-none duration-300';
  const legendStyle = 'fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]';
  const fieldsetStyle = 'fieldset gap-0 w-full';

  return (
    <dialog id="editOffre" className="modal">
      <div className="modal-box md:max-w-4xl bg-white p-8 rounded-2xl shadow-lg my-5 lg:my-0">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
        <h1 className="montserrat-hero font-bold text-2xl mb-6 text-sky-700">Modifier une offre</h1>

        {renderLoadingOrError() || (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {/* Colonne gauche */}
              <div className="flex flex-col space-y-4">
                <fieldset className={fieldsetStyle}>
                  <legend className={legendStyle}>Titre de l'offre :</legend>
                  <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className={inputStyle}
                    required
                  />
                </fieldset>
                <fieldset className={fieldsetStyle}>
                  <legend className={legendStyle}>Période :</legend>
                  <select
                    value={periodeId}
                    onChange={(e) => setPeriodeId(e.target.value)}
                    className={`${inputStyle} select`}
                    required
                  >
                    <option value="" disabled>
                      Choisir une période
                    </option>
                    {availablePeriodes?.data?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {formatDateRange(p.date_debut, p.date_fin)}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">Ajouter/Modifier des profils</h2>
                  <div className="flex flex-col gap-2">
                    <select
                      value={selectedProfilId}
                      onChange={(e) => setSelectedProfilId(e.target.value)}
                      className={`${inputStyle} select`}
                    >
                      <option value="">-- Choisir un profil --</option>
                      {availableProfils?.data?.map((profil) => (
                        <option key={profil.id} value={profil.id}>
                          {profil.nomProfil}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={nombreProfil}
                      onChange={(e) => setNombreProfil(e.target.value ? parseInt(e.target.value) : '')}
                      min="1"
                      className={`${inputStyle} w-full sm:w-24`}
                    />
                    <button
                      type="button"
                      onClick={handleAddProfil}
                      className="w-full sm:w-auto h-7 px-4 rounded-lg text-xs font-medium shadow-md bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      Ajouter
                    </button>
                  </div>
                  {error && <p className="text-error text-sm">{error}</p>}
                </div>
              </div>

              {/* Colonne droite */}
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <h3 className={legendStyle}>Profils actuels :</h3>
                  {profilsOffre.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2 border border-gray-100 rounded-lg p-2">
                      {profilsOffre.map((profil) => (
                        <div key={profil.profilId} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <span>
                            {getProfilNameById(profil.profilId)}{' '}
                            <span className="text-gray-500">({profil.nbProfil})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProfil(profil.profilId)}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 bg-gray-50 p-3 rounded-lg border">Aucun profil ajouté.</p>
                  )}
                </div>

                {formMessage.text && (
                  <p className={`text-${formMessage.type === 'success' ? 'success' : 'error'} text-sm`}>
                    {formMessage.text}
                  </p>
                )}

                <div className="modal-action mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 px-6 rounded-lg text-sm font-medium shadow-md bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {loading ? (
                        <span className="loading loading-spinner loading-md text-white "></span>
                        ) : "Enregistrer les modifications"
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
