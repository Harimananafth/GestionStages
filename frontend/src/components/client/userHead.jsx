import { Bell, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import Notification from '../common/notificationList';
import { ROUTES } from '../../routes/paths';

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function UserHeader() {

  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

  const [newNotification, setNewNotification] = useState(false);
  const user = JSON.parse(localStorage.getItem("utilisateur"));

  const { data, error, isLoading, mutate } = useSWR(`${ApiUrl}/notification/user`, fetcher);
  const { data : EtudiantInfo, error : getInfoError, isLoading : getInfoIsLoading} = useSWR(`${ApiUrl}/etudiant/${user.id}`, fetcher)

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  const photoUrl = `${ApiUrl}/user/photo`




  useEffect(() => {
        if(getInfoError)  console.log(getInfoError)
  
        const hasUnread = data?.data?.some(n => !n.lu) || false;
        setNewNotification(hasUnread);
  }, [data, EtudiantInfo]);

  const handleAllRead = async () => {
    try {
      await fetch(`${ApiUrl}/notification/`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const Logout = async () => {
    setMessage(null);
    setSuccess(null);

    try {
      const response = await fetch(`${ApiUrl}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("utilisateur");
        setSuccess("Déconnecté avec succès.");
        navigate(ROUTES.AUTH.LOGIN);
      }
    } catch (err) {
      setMessage("Erreur réseau. Veuillez réessayer.");
      console.error(err);
    }
  };

  return (
    <div className="navbar md:px-5 bg-white shadow-sm flex flex-col justify-between items-center gap-4 md:flex-row">
      {/* Logo */}
      <div className="flex gap-2 items-center hover:cursor-default rounded-xl md:grayscale-100 hover:grayscale-0 hover:-translate-y-1 duration-300">
        <img src="/images/logo.png" alt="Logo" className="h-6" />
        <p className="font-semibold text-lg lg-light">Neovate App</p>
      </div>

      {/* Notifications + User */}
      <div className="flex flex-row-reverse items-center justify-between w-full md:w-auto md:flex-row gap-2">
        
        {/*Notifications */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell color="#4F5D75" strokeWidth={1.5} size={20} />
              <span className={`indicator-item status shadow-none bg-none status-error ${ newNotification ? "block" : "hidden"}`}></span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1  mt-3  p-3 shadow-xl flex flex-col">
            {isLoading ? (
              <span className="loading loading-dots loading-xl grow"></span>
            ) : data && data.data ? (
              <div className='w-86 max-h-100 overflow-y-scroll px-1 box-content'>
                <Notification key={data.data.id} data={data} error={error} />
              </div>
            ) : null}

            <p
              className="label text-xs text-gray-300 block hover:cursor-pointer mt-3"
              role="button"
              onClick={handleAllRead}
            >
              Tout marquer comme lu
            </p>
          </ul>
        </div>

        {/*Utilisateur */}
        <div className=" dropdown dropdown-start mr-3">
          <div
            tabIndex={0}
            role="button"
            className="flex items-center justify-center gap-2 hover:cursor-pointer"
          >
            <div className="btn-circle avatar">
              <div className="w-8 rounded-full">
                <img
                  alt="Votre photo de profil"
                    src={photoUrl}
                    onError={(e) => { e.currentTarget.src = "/images/default-img-profil.png"; }}
                />
              </div>
            </div>
            <h1 className='font-semibold lg-light'>
                {getInfoIsLoading ? (
                    <span className="loading loading-dots loading-xs"></span>
                ) : (
                  EtudiantInfo ? EtudiantInfo?.data.prenom.split(" ")[0] + " " + EtudiantInfo?.data.nom : ""
                )
                }
            </h1>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="text-[#4F5D75] font-semibold text-sm mb-2.5">
                <User color="#4F5D75" strokeWidth={2.25} size={18} />
                Profile
              </a>
            </li>
            <li>
              <a className="text-error font-semibold text-sm" onClick={Logout}>
                <LogOut color="#ff637d" strokeWidth={2.25} size={18} />
                Se déconnecter
              </a>
              {message && <p className="label text-xs text-error mt-1">{message}</p>}
              {success && <p className="label text-xs text-success mt-1">{success}</p>}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
