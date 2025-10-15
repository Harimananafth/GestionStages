import { FileText, MoveLeft, User, Check, X, Clock } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useSWR from 'swr'


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

export default function ActionOnCandidature() {

    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const titre = location.state?.titre || ''; 

    const { data, error, isLoading, mutate } = useSWR(`${ApiUrl}/candidature/t/${id}`, fetcher);


    const profileImage = data?.data.photo ? (
        <img
            src={data.data.photo} 
            alt={`Photo de profil de ${data.data.nom}`}
            className="w-12 h-12 rounded-full object-cover"
        />
    ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={30} className="text-gray-500" />
        </div>
    )

    const statut = data?.data.statut || "";
    let statusClass = "text-gray-600";
    let statusText = `Status : ${statut}`;
    
    switch (statut) {
        case 'Acceptée':
            statusClass = "text-success font-bold";
            break;
        case 'Refusée':
            statusClass = "text-error font-bold";
            break;
        case 'En attente':
            statusClass = "text-warning font-bold";
            break;
        default:
            statusClass = "text-gray-600 font-bold";
    }


    if (isLoading) return (
        <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
            <span className="loading loading-dots loading-xl text-sky-500"></span>
        </div>
    );
    if (error) {
        return (
        <div className="h-full w-full flex justify-center items-center bg-white shadow-lg rounded-xl p-8 min-h-screen lg:min-h-0">
            <p className="text-error font-semibold text-lg">
               { error.info.message || "Erreur lors du chargement des données"}
            </p>
        </div>
    );}

    return (
        <div className="h-full w-full bg-white rounded-xl shadow-lg p-6 lg:p-9 animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-4">

            <a className="flex justify-start items-center gap-2 font-medium text-sky-600 hover:cursor-pointer"
                onClick={() => navigate(-1)}>
                <MoveLeft size={20} />
                Retour
            </a>


            <div className="flex flex-col gap-6 grow justify-center">

                {/* Info Candidat */}
                <div className="flex items-center gap-4 mb-3">
                    {profileImage}
                    <div>
                        <p className="font-bold text-lg text-gray-900">
                            {data?.data.nom || ""}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                            Candidature pour : <span className="font-semibold">{titre}</span>
                        </p>
                    </div>
                </div>

                {/* Boutons de fichiers */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleViewFile(data?.data.cv_path)}
                        className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-sky-500 text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-sky-600 hover:shadow-lg disabled:opacity-50"
                        disabled={!data?.data.cv_path || loading}
                    >
                        <FileText color="white" size={20} />
                        Voir le CV
                    </button>
                    <button
                        onClick={() => handleViewFile(data?.data.lm_path)}
                        className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-sky-500 text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-sky-600 hover:shadow-lg disabled:opacity-50"
                        disabled={!data?.data.lm_path || loading}
                    >
                        <FileText color="white" size={20} />
                        Voir la lettre de motivation
                    </button>
                </div>

                {/* Boutons d'Action  */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleUpdateStatus('Acceptée')}
                        className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-success text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-green-600 hover:shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        <Check color="white" size={20} />
                        Accepter
                    </button>
                    <button
                        onClick={() => handleUpdateStatus('Refusée')}
                        className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-red-500 text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-red-600 hover:shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        <X color="white" size={20} />
                        Refuser
                    </button>
                    <button
                        onClick={() => handleUpdateStatus('En attente')}
                        className="flex-1 px-4 py-3 flex justify-center items-center gap-2 bg-warning text-white rounded-lg text-base font-semibold shadow-md transition duration-300 hover:bg-yellow-600 hover:shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        <Clock color="white" size={20} />
                        Mettre en attente
                    </button>
                </div>

                {/*Statut */}
                <div className="mt-4 text-center">
                    <p className={`text-md ${statusClass}`}>
                        {statusText}
                    </p>
                </div>

            </div>
        </div>
    )
}