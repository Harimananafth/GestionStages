import { format } from 'date-fns'
import OffreCard from './offreCard'

export default function OffresList({ data, error }) {
  if (error)
    return (
      <div className="upEntry text-red-600 font-normal text-xl grow flex items-center justify-center">
        Erreur lors du chargement
      </div>
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

    const datePub = new Date(offre.date_publication);
    const isNew =
      (Date.now() - datePub.getTime()) / (1000 * 60 * 60 * 24) <= 7;

    return {
      id: offre.id,
      titre: offre.titre,
      profil: profilString,
      debut,
      fin,
      isNew,
    };
  });

  if (offres.length === 0)
    return (
      <div className="text-center text-gray-500 font-medium">
        Aucune offre trouvée
      </div>
    );

  return (
    <div className="grow flex flex-col gap-7 w-full">
      {offres.map((offre, index) => (
        <OffreCard key={offre.id} {...offre} index={index} />
      ))}
    </div>
  );
}

