import { Pencil, Trash, CirclePlus } from 'lucide-react'
import { useEffect, useState } from "react"
import useSWR from 'swr'
// Import des composants modaux (à créer ci-dessous)
import ProfilFormModal from './profilFormModal' 
import DeleteProfilModal from './deleteProfilModal' 

const fetcher = (...args) => fetch(...args, { credentials: 'include' }).then(res => res.json())

// Simuler ApiUrl pour l'environnement de démo (À adapter à votre configuration)
  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
  const PROFIL_API_URL = `${ApiUrl}/profil`;

// Composant pour afficher une carte de profil
const ProfilCard = ({ profil, onEdit, onDelete }) => (
  <div
    key={profil.id}
    className="bg-base-100 p-3 md:p-6 border border-gray-200 rounded-xl
               animate-[text-appear-bottom_0.3s_ease-in] hover:bg-gray-50 transition duration-150 ease-in-out"
  >
    <div className="flex justify-between items-start">
      <div className='flex-1 pr-4'>
        <h2 className="text-md font-bold text-gray-800">
          {profil.nomProfil}
        </h2>
        <p className="text-sm mt-1 text-gray-600">
          {profil.descriptionProfil}
        </p>
      </div>

      <div className="flex flex-shrink-0 gap-1 items-center mt-1">
        {/* Bouton Modifier */}
        <button
          className="btn btn-ghost btn-sm  text-sky-900 cursor-pointer p-2 rounded-full"
          onClick={() => onEdit(profil)}
          aria-label={`Modifier ${profil.nomProfil}`}
        >
          <Pencil size={18} />
        </button>
        {/* Bouton Supprimer */}
        <button
          className="btn btn-ghost btn-sm text-error cursor-pointer p-2 rounded-full"
          onClick={() => onDelete(profil)}
          aria-label={`Supprimer ${profil.nomProfil}`}
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  </div>
);


export default function MainAdminProfil() {
  const [selectedProfil, setSelectedProfil] = useState(null); // Pour la modification
  const [deletingProfilId, setDeletingProfilId] = useState(null); // Pour la suppression

  // SWR pour la récupération de la liste
  const { data, error, isLoading, mutate } = useSWR(PROFIL_API_URL, fetcher);

  useEffect(() => {
    document.title = "Gestion des Profils"
  }, []);
  
  // Fonctions de gestion des modaux
  const handleAdd = () => {
    setSelectedProfil(null); // S'assurer que c'est un ajout
    document.getElementById('profil_form_modal').showModal();
  };

  const handleEdit = (profil) => {
    setSelectedProfil(profil);
    document.getElementById('profil_form_modal').showModal();
  };

  const handleDelete = (profil) => {
    setDeletingProfilId(profil.id);
    document.getElementById('delete_profil_modal').showModal();
  };


  // Affichage du chargement et de l'erreur
  if (isLoading)
    return (
      <div className='h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-[50vh]'>
        <span className="loading loading-dots loading-lg text-sky-500"></span>
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 font-normal text-xl grow flex items-center justify-center p-10 bg-white shadow-lg rounded-xl">
        <p>Erreur lors du chargement des profils. Veuillez vérifier votre connexion.</p>
      </div>
    );
  
  const profils = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 
                    animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-6">

      <div className='flex justify-between items-center flex-wrap gap-4'>
        <h1 className="montserrat-hero font-bold text-xl text-sky-400">
          Profils :
        </h1>

        {/* Bouton Ajouter */}
        <button
          className="px-4 py-2 sm:px-6 flex justify-center items-center gap-2 hover:bg-sky-700 
              bg-sky-600 text-white rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer"
          onClick={handleAdd}
        >
          <CirclePlus color="white" absoluteStrokeWidth size={16}/>
          Ajouter
        </button>
      </div>

      <div className="flex-1 space-y-3 h-full overflow-auto">
        {profils.length === 0 ? (
          <div className="text-center text-gray-500 font-medium p-10 border-2 border-dashed rounded-xl bg-gray-50/50">
            <p>Aucun profil n'a été créé pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {profils.map((profil) => (
              <ProfilCard
                key={profil.id}
                profil={profil}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProfilFormModal 
        profil={selectedProfil} 
        mutate={mutate} 
        apiUrl={PROFIL_API_URL}
      />
      <DeleteProfilModal 
        profilId={deletingProfilId} 
        mutate={mutate} 
        apiUrl={PROFIL_API_URL}
      />
    </div>
  )
}