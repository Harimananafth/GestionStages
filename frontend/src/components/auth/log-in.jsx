import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";


export default function Login(){
    const [isVisible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const response = await fetch(`${ApiUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError(null);

                // Récupération des infos utilisateur
                const { id, email: userEmail, roles } = data.user;
                localStorage.setItem("utilisateur", JSON.stringify({ id, email: userEmail, roles }));

                // Redirection selon rôle
                if (roles.includes("admin")) {
                    navigate("/admin/");
                } else if (roles.includes("etudiant")) {
                    navigate("/etudiant/");
                } else {
                    navigate("/"); // fallback
                }

            } else {
                setError(data.message || "Erreur lors de la connexion.");
            }
        } catch (err) {
            setError("Erreur réseau. Veuillez réessayer.");
            console.error(err)
        } finally {
            setLoading(false);
        }    
    }


    return (
        <div className="container mx-auto h-screen flex justify-center items-center py-14 px-5">
            <div className="flex box-content animate-[text-appear-bottom_0.5s_ease-in] items-center justify-center gap-11 bg-white p-8 rounded-2xl shadow-lg w-[800px]">
                
                <div className="grow flex flex-col gap-4">

                    <div className="flex gap-2 items-center hover:cursor-default rounded-xl  hover:-translate-y-1 duration-300 w-fit">
                        <img src="/images/logo.png" alt="" className="h-4"/>
                        <p className="font-semibold text-xs lg:light">Neovate App</p>
                    </div>

                    <form className="flex flex-col" onSubmit={(e)=>{
                        handleSubmit(e)
                    }} >
                        <h1 className="montserrat-hero font-bold text-2xl ">Connexion</h1>
                        {/* Message : error or success */}
                        {error && <p className=' label text-xs text-error'>{error}</p>}
                        {success && <p className=' label text-xs text-success'>{success}</p>}

                        
                        <fieldset className="fieldset gap-0 w-full ">
                            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Adresse e-mail :</legend>
                            <input type="email" name='email' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Neovate@adresse.com" required/>
                        </fieldset>
                        <fieldset className="fieldset my-0 w-full ">
                            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Mot de passe :</legend>
                            <div className="flex relative">
                                <input type={isVisible ? "text" : "password"} name='password' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Neovate123!" required/>
                                {isVisible ? (
                                    <img src="/images/cacher.png" alt="" className="h-[16px] absolute right-3 top-3 hover:cursor-pointer z-10"  onClick={()=>{setVisible(false)}}/>
                                ) : (
                                    <img src="/images/voir.png" alt="" className="h-[16px] absolute right-3 top-3 hover:cursor-pointer z-10" onClick={()=>{setVisible(true)}}/>
                                )}
                            </div>
                            <a href="#" className=" text-gray-400 text-[0.75rem] underline">Mot de passe oublié</a>
                        </fieldset>
                        <button 
                        type="submit"
                        disabled={loading}
                        className="block w-full mt-2 hover:bg-sky-700 bg-sky-600 text-white h-10 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer">
                            {loading ? (
                                <span className="loading loading-spinner loading-md text-white "></span>
                                ) : "Se connecter"
                            }
                        </button>
                    </form>
                    <div className="flex flex-col items-start justify-center gap-3">
                        <p className="text-[0.75rem] text-neutral-600">Vous n'avez pas encore de compte ? <Link to="/auth/sign-up" className="text-sky-400  underline">S'inscrire</Link></p>
                        <a href={ApiUrl + "/auth/google"} className="flex justify-center gap-4 items-center border-1 border-gray-200 h-10 rounded-lg w-full text-sm text-[#4F5D75] font-semibold hover:cursor-pointer ">
                                <img src="/images/google.png" alt="logo de google" className="h-[16px]"/>
                                Continuer avec Google
                        </a>
                    </div>
                </div>
                <img src="/images/hello.gif" alt="Homme et femme qui se saluent et une pancarte qui dit Hello entre eux"  className="h-[380px] hidden md:block"/>
            </div> 
        </div>
    )
}