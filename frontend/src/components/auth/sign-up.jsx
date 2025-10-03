import { Link } from "react-router";

export default function SignUp(){
    return (
        <div className="container mx-auto h-screen flex justify-center items-center py-14 ">
            <div className="flex animate-[fadeIn_0.5s_ease-in] items-center justify-center gap-6 bg-white p-8 rounded-2xl shadow-lg w-[800px]">
                <div className="grow flex flex-col gap-4">
                    <div className="flex gap-2 items-center hover:cursor-default rounded-xl  hover:-translate-y-1 duration-300 w-fit">
                        <img src="/images/logo.png" alt="" className="h-4"/>
                        <p className="font-semibold text-xs lg:light">Neovate App</p>
                    </div>
                    <form action="submit" className="flex flex-col">
                        <h1 className="montserrat-hero font-bold text-2xl ">Inscription</h1>
                        <fieldset className="fieldset gap-0 w-full ">
                            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Adresse e-mail :</legend>
                            <input type="email" className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Neovate@adresse.com" required/>
                        </fieldset>
                        <fieldset className="fieldset my-0 w-full ">
                            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Mot de passe :</legend>
                            <input type="password" className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Neovate123!" required/>
                        </fieldset>
                        <fieldset className="fieldset my-0 w-full ">
                            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Confirmez le mot de passe :</legend>
                            <input type="password" className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Neovate123!" required/>
                        </fieldset>
                        <button className="block w-full mt-4 hover:bg-sky-700 bg-sky-600 text-white h-9 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer">
                            S'inscrire
                        </button>
                    </form>
                    <div className="flex flex-col items-start justify-center gap-3">
                        <p className="text-[0.75rem] text-neutral-600">Vous avez déjà un compte ? <Link to="/auth/" className="text-sky-400  underline">Se connecter</Link></p>
                        <button className="flex justify-center gap-4 items-center border-1 border-gray-200 h-9 rounded-lg w-full text-sm text-[#4F5D75] font-semibold hover:cursor-pointer ">
                            <img src="/images/google.png" alt="logo de google" className="h-[16px]"/>
                            S'inscrire avec Google
                        </button>
                    </div>
                </div>
                <img src="/images/welcome.gif" alt=""  className="h-[380px] hidden md:block"/>
            </div> 
        </div>
    )
}