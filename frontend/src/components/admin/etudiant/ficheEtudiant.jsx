import { 
    MoveLeft, 
    User, 
    Phone, 
    Home, 
    School, 
    Book, 
    Award, 
    Briefcase, 
    MailIcon
} from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import useSWR from 'swr';
import { format } from 'date-fns'; 
import { ROUTES } from '../../../routes/paths';

const fetcher = async (url) =>
    fetch(url, { credentials: 'include' }).then(async (res) => {
        if (!res.ok) {
            const error = new Error('Une erreur est survenue lors de la récupération de données');
            error.info = await res.json();
            error.status = res.status;
            throw error;
        }
        return res.json();
    });

// Composant information
const InfoBlock = ({ title, children }) => (
    <div className="p-4 sm:p-6 border-1 border-gray-200 rounded-xl bg-white ">
        <h3 className="text-lg mb-4 montserrat-hero font-bold text-sky-400">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {children}
        </div>
    </div>
);

// Composant champ d'information
const InfoItem = ({ icon, label, value }) => (
    <div className="flex gap-2 items-start">
        {icon && <span className="text-gray-500 mt-0.5 shrink-0">{icon}</span>}
        <div>
            <span className="font-semibold text-gray-800">{label}: </span>
            <span className="text-gray-600">{value || 'N/A'}</span>
        </div>
    </div>
);

// Carte pour la liste scrollable des candidatures
const CandidatureCard = ({ candidature, navigate }) => {
    const date = candidature.date_candidature
        ? format(new Date(candidature.date_candidature), 'dd/MM/yyyy')
        : 'Date inconnue';
    const titreOffre = candidature.Offre?.titre || "Offre inconnue";
    const idCandidature = candidature.id
    
    return (
        <div className="card bg-white shadow-sm p-4 shrink-0 w-76 lg:w-80 
                         animate-[text-appear-bottom_0.3s_ease-in] cursor-pointer"
            onClick={()=>navigate(ROUTES.ADMIN.CANDIDATURE_ACTION(idCandidature), { state: { titreOffre } })}
        >
            <h4 className="font-bold text-sky-800 truncate" title={titreOffre}>
                {titreOffre}
            </h4>
            <p className="text-sm mt-1">
                <span className="font-semibold text-gray-700">Profil postulé : </span>
                {candidature.Profil.nomProfil}
            </p>
            <p className="text-xs mt-2 text-gray-500">
                <span className="font-semibold">Postulé le : </span>
                {date}
            </p>
        </div>
    );
};


// Composant principal
export default function FicheEtudiant() {
    const ApiUrl = import.meta.env.PROD
      ? import.meta.env.VITE_PROD_API_URL
      : import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    
    const { id } = useParams(); 

    const apiUrl = id ? `${ApiUrl}/etudiant/fiche/${id}` : null;
    const { data, error, isLoading } = useSWR(apiUrl, fetcher);


    if (isLoading) return (
        <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-[50vh]">
            <span className="loading loading-dots loading-xl text-sky-500"></span>
        </div>
    );

    if (error) {
        return (
        <div className="h-full w-full flex flex-col gap-4 justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-[50vh]">
            <p className="text-error font-semibold text-lg">
                { error.info?.message || "Erreur lors du chargement de la fiche étudiant"}
            </p>
            <a 
                className="flex justify-start items-center gap-2 font-medium text-sky-600 hover:cursor-pointer w-fit"
                onClick={() => navigate(-1)}
            >
                <MoveLeft size={20} />
                Retour
            </a>
        </div>
    );}

    
    const etudiant = data?.data;

    if (!etudiant && id) { 
        return (
            <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-[50vh]">
               <p className="text-warning font-semibold text-lg">
                    Aucune donnée n'a été trouvée pour cet étudiant.
               </p>
            </div>
        )
   }

    const nomComplet = `${etudiant.nom || ''} ${etudiant.prenom || ''}`;
    const photoUrl = etudiant.Utilisateur?.photo;
    const candidatures = etudiant.Candidatures || [];

    // Composant pour l'image de profil 
    const profileImage = photoUrl ? (
        <img
            src={photoUrl}
            alt={`Photo de ${nomComplet}`}
            className="w-20 h-20 rounded-full object-cover shadow-md"
        />
    ) : (
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
            <User size={40} className="text-gray-500" />
        </div>
    );


    // Rendu du composant 
    return (
        <div className="min-h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 
                         animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-6">

            {/*Bouton Retour */}
            <a 
                className="flex justify-start items-center gap-2 font-medium text-sky-600 hover:cursor-pointer w-fit"
                onClick={() => navigate(-1)}
            >
                <MoveLeft size={20} />
                Retour
            </a>

            {/* En-tête (Photo, Nom, Spécialité) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4">
                {profileImage}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center sm:text-left">
                        {nomComplet}
                    </h1>
                    <p className="text-base text-gray-600 mt-1 text-center sm:text-left">
                        {etudiant.specialite}
                    </p>
                </div>
            </div>

            {/*  Blocs d'informations */}
            <div className="flex flex-col gap-6">
                
                {/* Informations personnelles */}
                <InfoBlock title="Informations personnelles">
                    <InfoItem 
                        icon={<Phone size={16} />} 
                        label="Téléphone " 
                        value={etudiant.telephone} 
                    />
                    <InfoItem 
                        icon={<MailIcon size={16} />} 
                        label="Email " 
                        value={etudiant.Utilisateur.email} 
                    />
                    <InfoItem 
                        icon={<Home size={16} />} 
                        label="Adresse " 
                        value={etudiant.adresse} 
                    />
                </InfoBlock>

                {/* Informations académiques */}
                <InfoBlock title="Informations académiques">
                    <InfoItem 
                        icon={<School size={16} />} 
                        label="Établissement " 
                        value={etudiant.ecole} 
                    />
                    <InfoItem 
                        icon={<Award size={16} />} 
                        label="Diplôme " 
                        value={etudiant.diplome} 
                    />
                    <InfoItem 
                        icon={<Book size={16} />} 
                        label="Niveau d'étude " 
                        value={etudiant.niveau} 
                    />
                    <InfoItem 
                        icon={<Briefcase size={16} />} 
                        label="Spécialité " 
                        value={etudiant.specialite} 
                    />
                </InfoBlock>
            </div>

            {/*  Liste des candidatures */}
            <div>
                <h2 className="text-xl montserrat-hero font-bold text-sky-400 mb-4">
                    Historique des candidatures ({candidatures.length})
                </h2>
                
                {candidatures.length > 0 ? (
                    // Conteneur
                    <div className="flex gap-4 overflow-x-auto p-4 bg-gray-50 rounded-xl min-h-[150px]">
                        {candidatures.map(c => (
                            <CandidatureCard key={c.id} candidature={c} navigate={navigate} />
                        ))}
                    </div>
                ) : (
                    // Message si aucune candidature
                    <div className="text-center text-gray-300 font-medium p-10 border-2 border-gray-200 border-dashed rounded-xl bg-gray-50/50">
                        <p>Cet étudiant n'a postulé à aucune offre pour le moment.</p>
                    </div>
                )}
            </div>

        </div>
    )
}