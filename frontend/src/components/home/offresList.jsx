import { format } from 'date-fns'
import {Server} from 'lucide-react'
import OffreCard from './offreCard'

export default function OffresList({ data, error }) {
    if (error) return <div className='upEntry text-red-600 font-normal text-xl grow flex items-center justify-center'>Erreur lors du chargement</div>

    const offres = data.data.map(offre => {
        // Profils
        const profilsArray = Array.isArray(offre.Profils) ? offre.Profils : []
        const profilString = profilsArray.map(p => `${p.nomProfil} (${p.OffreProfil?.nbProfil || 0})`).join(', ')

        // Période (objet unique)
        const periode = offre.Periode || { date_debut: '', date_fin: '' }
        const debut = periode.date_debut ? format(new Date(periode.date_debut), 'dd-MM-yyyy') : ''
        const fin = periode.date_fin ? format(new Date(periode.date_fin), 'dd-MM-yyyy') : ''

        // Calcul du badge "Nouveau" si date_publication < 7 jours
        const datePub = new Date(offre.date_publication)
        const isNew = (Date.now() - datePub.getTime()) / (1000 * 60 * 60 * 24) <= 7

        return {
            id: offre.id,
            titre: offre.titre,
            profil: profilString,
            debut,
            fin,
            isNew
        }
    })

    return (
        <div className="grow flex flex-col gap-7">
            {offres.map((offre, index) => (
                <OffreCard key={offre.id} {...offre} index={index}/>
            ))}
        </div>
    )
}
