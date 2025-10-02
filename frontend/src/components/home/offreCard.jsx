


export default function OffreCard(props){
    return(
        <div 
        key={props.id} 
        className='flex md:flex-row  flex-col md:gap-10 gap-8 justify-center items-start md:items-center border-gray-50 rounded-xl shadow-sm p-7 bg-white hover:-translate-y-1 hover:shadow-lg duration-300 upEntry'>
            <div className='h-12 w-12 rounded-full flex justify-center items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className='md:h-10 md:w-10 h-24 w-24' viewBox="0 0 24 24" fill="none" stroke="#01558b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-xml-icon lucide-code-xml"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </div>
            <div className='grow flex flex-col md:gap-1 gap-3 justify-center items-start'>
                <div className='flex sm:flex-row  flex-col justify-between gap-1 lg:gap-96  sm:gap-20'>
                    <h3 className='grow text-xl font-semibold mb-2'>{props.titre}</h3>
                    {
                        props.isNew ? <div className="badge badge-soft badge-success">Nouveau</div> : null
                    }
                </div>
                <p className='textC font-medium'>Profil : {props.profil}</p>
                <p className='text-xs font-extralight text-gray-500'>📅 De {props.debut} à {props.fin}</p>
            </div>
            <button className='hover:bg-sky-700 bg-sky-600 text-white md:w-26 w-1/1 h-9 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer'>
                Voir
            </button>
        </div>
    )
}