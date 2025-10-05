import { useState } from "react"

export default function MoreInfo(){
    const [loading, setLoading] = useState(false)
    return(
        <div className="container mx-auto min-h-screen flex justify-center items-center py-14 px-5">
            <div className="flex flex-col gap-4 animate-[text-appear-bottom_0.5s_ease-in] bg-white shadow-lg rounded-2xl p-8 w-[400px] md:w-[800px] box-content">
                <h1 className="montserrat-hero font-bold text-xl " >Dîtes-nous un peu plus sur vous</h1>
                <div>
                    <form className="flex flex-col md:flex-row md:gap-5 items-start">
                        <div className="flex flex-col md:w-1/2 w-full">
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Nom :</legend>
                                <input type="text" name='nom' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Neovate" required/>
                            </fieldset>                            
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Prénom(s) :</legend>
                                <input type="text" name='prenom' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Mes Prénoms" required/>
                            </fieldset>
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Etablissement scolaire / universitaire :</legend>
                                <input type="text" name='ecole' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="ENI Fianarantsoa" required/>
                            </fieldset>                            
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Niveau d'étude et diplôme : </legend>
                                <div className="flex justify-between items-center gap-2.5">
                                    <input type="text" name='diplome' className="input text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Baccalauréat" required/>
                                    <select defaultValue="Choisir un niveau" className="select text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300 ">
                                        <option disabled={true}>Choisir un niveau</option>
                                        <option>L1</option>
                                    </select>
                                </div>
                            </fieldset>
                        </div>

                        <div className="flex flex-col md:w-1/2 w-full">
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Spécialité :</legend>
                                <input type="text" name='spec' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="Développeur web fullstack" required/>
                            </fieldset>                             
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Numéro de téléphone :</legend>
                                <input type="number" maxLength={10} name='num' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="03x xx xxx xx" required/>
                            </fieldset>                             
                            <fieldset className="fieldset gap-0 w-full ">
                                <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75] ">Adresse postale :</legend>
                                <input type="text" name='adresse' className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300" placeholder="lot 123 adresse ville " required/>
                            </fieldset>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="  w-full mt-7 hover:bg-sky-700 bg-sky-600 text-white h-12  rounded-lg text-md font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer">
                                {loading ? (
                                    <span className="loading loading-spinner loading-md text-white "></span>
                                    ) : "Valider"
                                }
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}