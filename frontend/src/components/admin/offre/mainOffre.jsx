import { CirclePlus, EllipsisVertical, Pencil, Trash } from 'lucide-react'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { format } from 'date-fns'
import CreateOfferModal from './createOffreModal'
import EditOfferModal from './editOffreModal'
import CreatePeriodeModal from './createPeriodeModal'
import DeleteOffreModal from './deleteOffreModal'
import { ROUTES } from '../../../routes/paths'

const fetcher = (...args) => fetch(...args).then(res => res.json())

//  Carte 
const OffreCard = ({ offre, buttonEdit, openCandidature }) => (
  <div
    key={offre.id}
    onClick={() => {openCandidature()}}
    className="card bg-base-100 shadow-md mb-4 p-4 border border-gray-100 
               animate-[text-appear-bottom_0.3s_ease-in] hover:bg-gray-50 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <h2 className="text-lg font-bold text-sky-600">{offre.titre}</h2>
      <div className="flex-shrink-0">
        {buttonEdit()}
      </div>
    </div>
    <div className="divider my-1"></div>
    <p className="text-sm">
      <span className="font-semibold text-gray-700">Profils: </span>
      {offre.profil}
    </p>
    <p className="text-sm mt-1">
      <span className="font-semibold text-gray-700">Durée: </span>
      Du {offre.debut} au {offre.fin}
    </p>
    <p className="text-xs mt-2 text-gray-500">
      <span className="font-semibold">Publié le: </span>
      {offre.datePub}
    </p>
  </div>
);



//  Composant principal 
export default function MainAdminOffre(){
  const [selectedOffreId, setSelectedOffreId] = useState(null);
  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

  const { data, error, isLoading, mutate } = useSWR(`${ApiUrl}/offre/`, fetcher);
  const navigate = useNavigate()

  useEffect(()=>{
    document.title = "Offres de stage"
  }, []);

  const openCandidature = (id, titre) => {
    navigate(ROUTES.ADMIN.OFFRE_CANDIDATURE(id), { state: { titre } })
  }

  // Bouton Edit / Delete 
  const buttonEdit = (offre) => {
    return (
      <div 
        className="dropdown dropdown-end"
        onClick={(e) => e.stopPropagation()} 
      > 
        <EllipsisVertical 
          tabIndex={0} 
          size={20} 
          role="button" 
          className="text-gray-600 rounded-lg text-sm font-medium duration-300 hover:cursor-pointer" 
        />
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box z-50 w-fit p-2 shadow-lg textC font-semibold bg-white"
        > 
          <li>
            <a
              onClick={() => {
                setSelectedOffreId(offre.id);
                document.getElementById('editOffre').showModal();
              }}
              className="flex justify-start items-center gap-2 text-sky-900"
            >
              <Pencil size={16}/> Modifier
            </a>
          </li>

          <li>
            <a 
              className="flex text-error justify-start items-center gap-2"
              onClick={() =>{
                setSelectedOffreId(offre.id);
                document.getElementById('deleteOffre').showModal();
              }}
            >
              <Trash size={16}/>
              Supprimer
            </a>
          </li>
        </ul>
      </div>
    )
  }

  const buttonEditForTable = (offre) => (
    <td className="w-px"> 
      {buttonEdit(offre)}
    </td>
  )

  //  Liste des offres 
  const OffresList = () => {
    const rawData = Array.isArray(data?.data) ? data.data : [];
    const offres = rawData.map((offre) => {
      const profilsArray = Array.isArray(offre.Profils) ? offre.Profils : [];
      const profilString = profilsArray
        .map((p) => `${p.nomProfil} (${p.OffreProfil?.nbProfil || 0})`)
        .join(', ');

      const periode = offre.Periode || { date_debut: '', date_fin: '' };
      const debut = periode.date_debut
        ? format(new Date(periode.date_debut), 'dd-MM-yyyy')
        : '';
      const fin = periode.date_fin
        ? format(new Date(periode.date_fin), 'dd-MM-yyyy')
        : '';
      const datePub = offre.date_publication
        ? format(new Date(offre.date_publication), "dd-MM-yyyy")
        : "";

      return {
        id: offre.id,
        titre: offre.titre,
        profil: profilString,
        debut,
        datePub,
        fin
      };
    });


    if(isLoading)
      return (
        <div className='flex justify-center items-center h-full grow p-10'>
          <span className="loading loading-dots loading-lg text-sky-500"></span>
        </div>
      );

    if (error)
      return (
        <div className="upEntry text-red-600 font-normal text-xl grow flex items-center justify-center p-10">
          <p>Erreur lors du chargement des offres.</p>
        </div>
      );
    
    if (offres.length === 0)
      return (
        <div className="text-center text-gray-500 font-medium p-10">
          <p>Aucune offre trouvée.</p>
        </div>
      );
    
    //  Table et cartes 
    return (
      <>
        <div className="overflow-x-auto hidden lg:block"> 
          <table className="table table-zebra w-full">
            <thead className='text-black'>
              <tr>
                <th>Titre</th>
                <th>Profil (nombre)</th>
                <th className='w-1/4'>Durée</th> 
                <th>Date de création</th>
                <th className='w-px'></th>
              </tr>
            </thead>
            <tbody>
              {offres.map((offre) => (
                <tr 
                  key={offre.id}
                  onClick={() => {openCandidature(offre.id, offre.titre)}}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="font-semibold text-sky-800">{offre.titre}</td>
                  <td>{offre.profil}</td>
                  <td>{offre.debut} à {offre.fin}</td>
                  <td>{offre.datePub}</td>
                  {buttonEditForTable(offre)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-3">
          {offres.map((offre) => (
            <OffreCard 
              key={offre.id} 
              offre={offre} 
              buttonEdit={() => buttonEdit(offre)}
              openCandidature={() => openCandidature(offre.id, offre.titre)} 
            />
          ))}
        </div>
      </>
    );
  }

  //  Rendu principal 
  return(
    <div className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 
                    animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-4 min-h-screen lg:min-h-0" >
      
      <div className='flex justify-between items-center flex-wrap gap-2'>
        <h1 className="montserrat-hero font-bold text-xl text-sky-400">
          Offres de stage
        </h1>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="px-4 py-2 sm:px-6 flex justify-center items-center gap-2 hover:bg-sky-700 
              bg-sky-600 text-white rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer">
            <CirclePlus color="white" absoluteStrokeWidth size={16}/>
            Ajouter
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-50 w-52 p-2 shadow-sm textC font-semibold bg-stone-50">
              <li><a onClick={()=>document.getElementById('createOffre').showModal()}> Offre de stage</a></li>
              <li><a onClick={()=>document.getElementById('createPeriode').showModal()}> Période de stage</a></li>
          </ul>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {OffresList()}
      </div>

      {/* Pop-ups */}
      <CreateOfferModal mutate={mutate}/>
      <CreatePeriodeModal mutate={mutate}/>
      <EditOfferModal offreId={selectedOffreId} mutate={mutate} />
      <DeleteOffreModal offreId={selectedOffreId}/>
    </div>
  )
}
