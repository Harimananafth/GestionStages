import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-sky-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-3">Page non trouvée</h2>
        
        <p className="text-gray-500 mb-8">
          Désolé, l'adresse que vous avez demandée n'existe pas.
        </p>
        
        <Link 
          to={ROUTES.HOME} 
          className=" btn text-white bg-sky-500 hover:bg-sky-600 p-4 font-medium shadow-md transition duration-300"
        >
          Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
}