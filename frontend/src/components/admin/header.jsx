import { Bell, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import Notification from '../common/notificationList';

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());


export default function UserHeader(){
    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

    const [newNotification, setNewNotification] = useState(false)

    const user = JSON.parse(localStorage.getItem("utilisateur"));

    const { data, error, isLoading, mutate } = useSWR(`${ApiUrl}/notification/admin`, fetcher)
    
    const navigate = useNavigate()
    const [message, setMessage] =  useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
    const hasUnread = data?.data?.some(n => !n.lu) || false;
    setNewNotification(hasUnread);
    }, [data]);


    const handleAllRead = async () =>{
        try{
            await fetch(`${ApiUrl}/notification/admin`, {
                method : "PUT",
                credentials : "include",
                headers: { "Content-Type": "application/json" }
            })

            mutate()

        }catch(err){
            console.log(err)
        }

    }

    const Logout = async () =>{
        setMessage(null)
        setSuccess(null)

        try{
            const response =  await fetch (`${ApiUrl}/auth/logout`, {
                method: "GET",
                credentials: "include",
            })
            if(response.ok){
                localStorage.removeItem("utilisateur")
                setSuccess("Déconnecté avec succès.")
                navigate("/")
            }
        }catch(err){
            setMessage("Erreur réseau. Veuillez réessayer.")
            console.error(err)
        }
    }
    return (
        <div className="navbar bg-white shadow-sm flex justify-between items-center">
            <div className="flex gap-2 items-center hover:cursor-defaul pl-3 rounded-xl md:grayscale-100 hover:grayscale-0 hover:-translate-y-1 duration-300">
                <img src="/images/logo.png" alt="" className="h-6"/>
                <p className="font-semibold text-lg lg-light">Neovate App</p>
            </div>

            {/* Notification */}

            <div className="flex gap-8 items-center">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <Bell color="#4F5D75" strokeWidth={1.5} size={20}/>
                            <span className={`indicator-item status status-error shadow-none bg-red-500 ${ newNotification ? "block" : "hidden"}`}></span>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-100 shadow">
                        {isLoading ? (
                            <span className="loading loading-dots loading-xl grow"></span>
                        ) : data && data.data ? (
                            <Notification key={data.data.id} data={data} error={error} />
                        ) : (
                            null
                        )}

                        <p className='label text-xs text-gray-300 block hover:cursor-pointer mt-3' role='button' onClick={handleAllRead}> Tout marquer comme lu</p>
                    </ul>
                </div>


                {/* Badge Utilisateur */}


                <div className="dropdown dropdown-end mr-3">
                    <div tabIndex={0} role="button" className=' flex items-center justify-center gap-2 hover:cursor-pointer'>
                        <div  className=" btn-circle avatar">
                            <div className="w-8 rounded-full">
                                <img
                                    alt="Votre photo de profil"
                                    src={ user.photo || "/images/default-img-profil"} />
                            </div>
                        </div>
                        <h1 className='font-semibold lg-light'>{ user.email }</h1>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className='text-error font-semibold text-sm' onClick={Logout}>
                                <LogOut color="#ff637d" strokeWidth={2.25} size={18}/>
                                Se déconnecter
                            </a>
                            {message && <p className=' label text-xs text-error mt-1'>{message}</p>}
                            {success && <p className=' label text-xs text-success mt-1'>{success}</p>}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}