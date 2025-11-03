import { MoveLeft, User, Mail, BookOpen, University, FileUser, Check, X, Clock } from "lucide-react" 
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useSWR from 'swr'
import { useState, useMemo } from "react"; 
import { ROUTES } from '../../../routes/paths'


const CandidatureCard = ({ nom, photo, email, ecole, niveau, navigate, id, titre, profil, statut }) => {
    // Icône par défaut si pas de photo
    const ProfileImage = photo ? (
        <img
            src={photo}
            alt={`Photo de profil de ${nom}`}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
        />
    ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={30} className="text-gray-500" />
        </div>
    );
    
    // Détermination de la couleur en fonction du statut
    let statusColor = "text-gray-500";
    let statusIcon = <Clock size={16} className="text-gray-400" />;
    switch (statut) {
        case 'Acceptée':
            statusColor = "text-success";
            statusIcon = <Check size={16} className="text-success" />;
            break;
        case 'Refusée':
            statusColor = "text-error"; 
            statusIcon = <X size={16} className="text-error" />;
            break;
        default: // En attente
            statusColor = "text-warning"; 
            statusIcon = <Clock size={16} className="text-warning" />;
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="flex-shrink-0 flex items-center gap-4">
                {ProfileImage}
                <div>
                    <p className="montserrat-hero font-bold text-base sm:text-lg text-gray-800">{nom}</p>
                    <p className="text-sm text-sky-600 font-medium flex items-center gap-1 mt-1">
                        <University size={16} className="text-sky-400 hidden sm:inline" />
                        {ecole}
                    </p>
                    <p className="text-sm text-sky-600 font-medium flex items-center gap-1 mt-1">
                        <FileUser size={16} className="text-sky-400 hidden sm:inline" />
                        {profil}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0 gap-2 sm:gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-sky-400 flex-shrink-0" />
                    <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-sky-400 flex-shrink-0" />
                    <span className="font-medium">{niveau}</span>
                </div>
            </div>
            
            <div className={`flex items-center gap-1 text-sm font-semibold ${statusColor} ml-0 sm:ml-auto mt-2 sm:mt-0`}>
                {statusIcon}
                <span className="text-xs sm:text-sm">{statut}</span>
            </div>

            <button className="ml-auto text-sky-500 hover:text-sky-600 text-sm font-semibold underline underline-offset-2"
            onClick={()=>navigate(ROUTES.ADMIN.CANDIDATURE_ACTION(id), { state: { titre } })}>
                Action
            </button>
        </div>
    );
};


// fetcher 
const fetcher = async (url) =>
    fetch(url, { credentials: 'include' }).then(async (res) => {
        if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.');
            error.info = await res.json();
            error.status = res.status;
            throw error;
        }
        return res.json();
    });


// Composant principal
export default function OffreCandidature(){
    const ApiUrl = import.meta.env.PROD
      ? import.meta.env.VITE_PROD_API_URL
      : import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // État pour le filtre de statut
    const [filterStatus, setFilterStatus] = useState('Tous'); 

    const { data, error, isLoading } = useSWR(`${ApiUrl}/candidature/${id}`, fetcher);

    const titre = location.state?.titre || '';
    
    // Données brutes
    const candidatures = data?.data || [];
    
    // Filtrage des candidatures avec useMemo pour optimiser les performances
    const filteredCandidatures = useMemo(() => {
        if (filterStatus === 'Tous') {
            return candidatures;
        }
        return candidatures.filter(c => c.statut === filterStatus);
    }, [candidatures, filterStatus]);
    
    
    if (isLoading) return (
        <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
            <span className="loading loading-dots loading-xl text-sky-500"></span>
        </div>
    );
    if (error) {
        return (
        <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
            <p className="text-error font-semibold text-lg">
                { error.info.message || "Erreur lors du chargement des candidatures"}
            </p>
        </div>
    );}

    return (
        <div className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8
                         animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-4">
            
            {/* Entête */}
            <div>
                <a className="flex justify-start items-center gap-2 montserrat-hero font-bold text-sm text-sky-500 hover:text-sky-600 hover:cursor-pointer transition duration-200"
                onClick={()=>navigate(-1)}>
                    <MoveLeft size={20} />
                    <span className="hidden sm:inline">Retour aux offres</span>
                    <span className="sm:hidden">Retour</span>
                </a>
                <h1 className="montserrat-hero font-bold text-lg sm:text-2xl mt-3 text-gray-800">
                   <span className="font-medium text-gray-500">Candidature(s) pour : </span>{titre}
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    {filteredCandidatures.length} candidat(s) affiché(s) sur {candidatures.length} au total
                </p>
            </div>

            <hr className="text-gray-200"/>
            
            {/*Système de tri/filtre */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                <p className="text-sm font-semibold text-gray-700">Filtrer par statut :</p>
                
                {/* Boutons de Filtre */}
                {['Tous', 'En attente', 'Acceptée', 'Refusée'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`
                            py-1 px-3 text-xs sm:text-sm rounded-full transition duration-200
                            ${filterStatus === status
                                ? 'bg-sky-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                            ${status === 'Acceptée' && filterStatus !== 'Acceptée' ? 'hover:text-success' : ''}
                            ${status === 'Refusée' && filterStatus !== 'Refusée' ? 'hover:text-error' : ''}
                            ${status === 'En attente' && filterStatus !== 'En attente' ? 'hover:text-warning' : ''}
                        `}
                    >
                        {status}
                    </button>
                ))}
            </div>


            {/*Liste des Candidatures */}
            {filteredCandidatures.length > 0 ? (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] p-1">
                    {filteredCandidatures.map((candidat) => (
                        <CandidatureCard
                            key={candidat.idCandidature}
                            nom={candidat.nom}
                            photo={candidat.photo}
                            email={candidat.email}
                            ecole={candidat.ecole}
                            niveau={candidat.niveau}
                            profil = {candidat.profilPostule}
                            id={candidat.idCandidature}
                            titre={titre}
                            navigate={navigate}
                            statut={candidat.statut}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 h-full">
                    <p className="text-lg font-semibold text-gray-600">
                        {filterStatus === 'Tous' ? "Aucune candidature trouvée pour cette offre." : `Aucune candidature "${filterStatus}" trouvée.`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        {filterStatus === 'Tous' ? "Revenez plus tard ou vérifiez les autres offres." : "Essayez un autre filtre pour voir d'autres candidatures."}
                    </p>
                </div>
            )}
        </div>
    )
}