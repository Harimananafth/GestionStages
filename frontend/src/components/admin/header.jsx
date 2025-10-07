import { Bell, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function Header(){
    useEffect(()=>{
        document.title = "Dashboard | Admin"
    }, [])

    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const [message, setMessage] =  useState(null)
    const [success, setSuccess] = useState(null)

    const user = localStorage.getItem("utilisateur")
    const email = user.email


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
                navigate("/auth")
            }
        }catch(err){
            setMessage("Erreur réseau. Veuillez réessayer.")
            console.error(err)
        }
    }
    return (
        <div className="navbar bg-white shadow-sm flex justify-between ">
            <div className="flex gap-2 items-center hover:cursor-defaul pl-3 rounded-xl md:grayscale-100 hover:grayscale-0 hover:-translate-y-1 duration-300">
                <img src="/images/logo.png" alt="" className="h-6"/>
                <p className="font-semibold text-lg lg-light">Neovate App</p>
            </div>
            <div className="flex gap-5">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <Bell color="#4F5D75" strokeWidth={1.5} />
                            <span className="badge  badge-sm indicator-item bg-red-600 text-white">1</span>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-100 shadow">
                        <li>
                            <div className="card bg-base-100 border-b-1 border-gray-100 shadow-none">
                                <div className="card-body">
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="dropdown dropdown-end mr-3">
                    <div tabIndex={0} role="button" className=' flex items-center justify-center gap-2 hover:cursor-pointer'>
                        <div  className=" btn-circle avatar">
                            <div className="w-8 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <h1 className='font-semibold lg-light'> { email || "Administrateur" } </h1>
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