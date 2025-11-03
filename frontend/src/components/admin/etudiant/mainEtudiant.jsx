import { EllipsisVertical, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import DeleteEtudiantModal from "./deleteEtudiantModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";

const fetcher = (...args) =>
  fetch(...args, { credentials: "include" }).then((res) => res.json());

// Carte pour le responsive (mobile)
const EtudiantCard = ({ etudiant, actionMenu, navigate }) => (
  <div
    key={etudiant.id}
    className="card bg-base-100 shadow-md mb-4 p-4 border border-gray-100 
               animate-[text-appear-bottom_0.3s_ease-in] hover:bg-gray-50"
    onClick={() => navigate(ROUTES.ADMIN.ETUDIANT_FICHE(etudiant.id))}
  >
    <div className="flex justify-between items-start">
      <h2 className="text-lg font-bold text-sky-600">{etudiant.nomComplet}</h2>
      <div className="flex-shrink-0">{actionMenu()}</div>
    </div>
    <div className="divider my-1"></div>
    <p className="text-sm mt-1">
      <span className="font-semibold text-gray-700">École: </span>
      {etudiant.ecole}
    </p>
    <p className="text-sm mt-1">
      <span className="font-semibold text-gray-700">Niveau: </span>
      {etudiant.niveau} ({etudiant.specialite})
    </p>
    <p className="text-sm mt-1">
      <span className="font-semibold text-gray-700">Tél: </span>
      {etudiant.telephone}
    </p>
    <p className="text-xs mt-2 text-gray-500">
      <span className="font-semibold">Adresse: </span>
      {etudiant.adresse}
    </p>
  </div>
);

// Composant principal
export default function MainAdminEtudiant() {
  const [selectedEtudiantId, setSelectedEtudiantId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const ApiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Effet de debounce pour la recherche
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= 3) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Définition de l'URL pour SWR
  const apiUrl =
    debouncedSearchTerm.length >= 3
      ? `${ApiUrl}/etudiant/?search=${debouncedSearchTerm}`
      : debouncedSearchTerm.length === 0
      ? `${ApiUrl}/etudiant/`
      : null; // Le null empêche la requête si < 3 et pas vide

  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher);

  useEffect(() => {
    document.title = "Liste des étudiants";
  }, []);

  // Menu d'action (Supprimer)
  const actionMenu = (etudiant) => {
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
              className="flex text-error justify-start items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEtudiantId(etudiant.id);
                document.getElementById("deleteEtudiant").showModal();
              }}
            >
              <Trash size={16} />
              Supprimer
            </a>
          </li>
        </ul>
      </div>
    );
  };

  // Wrapper pour le menu d'action dans le tableau
  const actionMenuForTable = (etudiant) => (
    <td className="w-px" onClick={(e) => e.stopPropagation()}>
      {actionMenu(etudiant)}
    </td>
  );

  // Composant de liste
  const EtudiantsList = () => {
    // Préparation des données
    const rawData = Array.isArray(data?.data) ? data.data : [];
    const etudiants = rawData.map((etudiant) => {
      return {
        id: etudiant.id,
        nomComplet: `${etudiant.nom || ""} ${etudiant.prenom || ""}`.trim(),
        telephone: etudiant.telephone,
        adresse: etudiant.adresse,
        ecole: etudiant.ecole,
        niveau: etudiant.niveau,
        specialite: etudiant.specialite,
      };
    });

    if (isLoading)
      return (
        <div className="flex justify-center items-center h-full grow p-10">
          <span className="loading loading-dots loading-lg text-sky-500"></span>
        </div>
      );

    if (error)
      return (
        <div className="upEntry text-red-600 font-normal text-xl grow flex items-center justify-center p-10">
          <p>
            Erreur lors du chargement des étudiants. Veuillez vérifier votre
            connexion.
          </p>
        </div>
      );

    if (etudiants.length === 0)
      return (
        <div className="text-center text-gray-500 font-medium p-10">
          <p>
            {debouncedSearchTerm.length >= 3 || searchTerm.length > 0
              ? "Aucun étudiant ne correspond à votre recherche."
              : "Aucun étudiant trouvé."}
          </p>
        </div>
      );

    // Rendu du tableau et des cartes
    return (
      <>
        {/* Vue Tableau (grands écrans) */}
        <div className="hidden lg:block ">
          <table className="table table-zebra w-full">
            <thead className="text-black">
              <tr>
                <th>Nom complet</th>
                <th>Contact (Tél)</th>
                <th className="w-1/4">Établissement</th>
                <th>Niveau / Spécialité</th>
                <th className="w-px"></th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((etudiant) => (
                <tr
                  key={etudiant.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    navigate(ROUTES.ADMIN.ETUDIANT_FICHE(etudiant.id))
                  }
                >
                  <td className="font-semibold text-sky-800">
                    {etudiant.nomComplet}
                  </td>
                  <td>{etudiant.telephone}</td>
                  <td>{etudiant.ecole}</td>
                  <td>
                    {etudiant.niveau} / {etudiant.specialite}
                  </td>
                  {actionMenuForTable(etudiant)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vue Cartes (petits écrans) */}
        <div className="lg:hidden space-y-3">
          {etudiants.map((etudiant) => (
            <EtudiantCard
              key={etudiant.id}
              etudiant={etudiant}
              actionMenu={() => actionMenu(etudiant)}
              navigate={navigate}
            />
          ))}
        </div>
      </>
    );
  };

  // Rendu principal
  return (
    <div
      className="h-full w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 
                     animate-[text-appear-bottom_0.5s_ease-in] flex flex-col gap-4"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="montserrat-hero font-bold text-xl text-sky-400">
          Gestion des étudiants
        </h1>

        {/* Barre de recherche */}
        <div className="form-control w-full sm:w-auto sm:min-w-72 relative">
          <input
            type="text"
            className="pl-10 z-10 pr-4 py-2 input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
            placeholder="Rechercher par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={16}
            className="text-gray-400 absolute top-3 left-3 z-20"
          />
        </div>
      </div>

      {/* Conteneur de la liste */}
      <div className="flex-1 overflow-auto">{EtudiantsList()}</div>

      {/* Pop-up de suppression */}
      <DeleteEtudiantModal etudiantId={selectedEtudiantId} mutate={mutate} />
    </div>
  );
}
