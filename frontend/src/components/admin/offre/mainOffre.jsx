import { CirclePlus, EllipsisVertical, Pencil, Trash } from 'lucide-react'
import { useEffect } from "react"
import useSWR from 'swr'
import { format } from 'date-fns'


const fetcher = (...args) => fetch(...args).then(res => res.json())


export default function MainAdminOffre(){
    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

    const { data, error, isLoading } = useSWR(`${ApiUrl}/offre/`, fetcher)
    console.log(data)

    useEffect(()=>{
        document.title = "Offre de stage"
    })

    // Button modifier et supprimer
    const buttonEdit = () => {
        return(
            <td className="dropdown dropdown-end">
                <EllipsisVertical tabIndex={0} size={20} role="button" className=" text-gray-600 rounded-lg text-sm font-medium duration-300 hover:cursor-pointer" />
                <ul
                    tabIndex={0}
                    className="dropdown-content menu rounded-box z-1 p-2 shadow-sm textC   font-semibold bg-white">
                        <li>
                          <a className='flex justify-start items-center gap-2 text-sky-900'>
                            <Pencil size={16}/>
                             Modifier
                          </a>
                        </li>
                        <li>
                          <a className='flex text-error justify-start items-center gap-2'>
                            <Trash size={16}/>
                             Supprimer
                          </a>
                        </li>
                        
                </ul>
            </td>
        )
    }

    // Liste des offres

    const OffresList = () => {
      if (error)
        return (
          <tbody className="upEntry text-red-600 font-normal text-xl grow flex items-center justify-center">
              <tr><td colSpan={6}>Erreur lors du chargement</td></tr>
          </tbody>
        );
    
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
    
      if (offres.length === 0)
        return (
          <tbody className="text-center text-gray-500 font-medium">
            <tr><td colSpan={6}>Aucune offre trouvée</td></tr>
          </tbody>
        );
    
      return (
        <tbody>
          {offres.map((offre, index) => (
            <tr key={offre.id}>
              <td>{offre.titre}</td>
              <td>{offre.profil}</td>
              <td>{offre.debut}  à  {offre.fin}</td>
              <td>{offre.datePub}</td>
              {buttonEdit()}
            </tr>
          ))}
        </tbody>
      );
    }


    return(
        <div className="h-full w-full bg-white rounded-xl shadow-lg p-6 px-8 animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-4" >
            <div className='flex justify-between items-center'>
                <h1 className="montserrat-hero font-bold text-xl text-sky-400">Actualités</h1>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="px-6 py-2 flex justify-center items-center gap-2 hover:bg-sky-700 bg-sky-600 text-white rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer">
                        <CirclePlus color="white" absoluteStrokeWidth size={16}/>
                        Ajouter
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm textC   font-semibold bg-stone-50">
                            <li><a> Offre de stage</a></li>
                            <li><a> Période de stage</a></li>
                    </ul>
                </div>
            </div>
            {/* Liste des offres */}
            <div className="grow overflow-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead className='text-black'>
                    <tr>
                        <th>Titre</th>
                        <th>Profil</th>
                        <th>Durée</th>
                        <th>Date de création</th>
                        <th></th>
                    </tr>
                    </thead>
                      {OffresList()}
                </table>
            </div>
        </div>
    )
}