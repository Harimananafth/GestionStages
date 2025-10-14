import { useState } from "react"

export default function DeleteOffreModal({offreId}){

    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;


    const [loading, setLoading] = useState(false)
    
    const handleDelete = async (e) => {
            setLoading(true)
          e.preventDefault()
    
          try{
            const response =  await fetch(`${ApiUrl}/offre/${offreId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            })
            if (response.ok){
              alert("L'offre a bien été supprimée.")
              document.getElementById('deleteOffre').close();
            }
          }catch(err){
            alert("Erreur lors de la suppression, veuillez réessayer.")
          }finally{
            setLoading(false)
          }
    
    }
    return(
        <dialog id="deleteOffre" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h1 className="montserrat-hero font-bold text-xl">Suppression</h1>
                <p className="py-4">Voulez-vous vraiment supprimer cette offre ?</p>

                <div className="flex items-center justify-end gap-3 mt-5">
                    <button className="btn btn-active btn-error text-white"
                    disabled={loading}
                    onClick={handleDelete}>
                        {loading ? (
                                <span className="loading loading-spinner loading-md text-white "></span>
                                ) : "Supprimer"
                        }
                    </button>
                    <button className="btn"
                     disabled={loading}
                     onClick={()=>{
                        document.getElementById('deleteOffre').close();
                        window.location.reload()
                     }}     
                     >
                        Annuler
                    </button>
                </div>
            </div>
        </dialog>
    )
}