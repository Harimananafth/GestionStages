import { Bell, LogOut } from 'lucide-react'

export default function Header(){
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
                        <h1 className='font-semibold lg-light'>Administrateur</h1>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className='text-error font-semibold text-sm'>
                                <LogOut color="#ff637d" strokeWidth={2.25} size={18}/>
                                Se déconnecter
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}