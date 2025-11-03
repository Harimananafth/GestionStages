import {Server} from 'lucide-react'

export default function CardLanding(props){
    return(
            <div className='upEntry flex gap-10 justify-center items-center border-gray-50 rounded-xl shadow-sm p-7 bg-white hover:-translate-y-1 hover:shadow-lg duration-300'>
                <div className='h-16 w-16 rounded-full bg-gray-100 flex justify-center items-center'>
                    <Server strokeWidth={2.25} color="#01558b" size={30} />
                </div>
                <div className='grow flex flex-col gap-1 justify-center items-start'>
                    <div className='flex gap-96'>
                        <h3 className='grow text-xl font-semibold mb-2'>{props.titre}</h3>
                        {
                            props.isNew ? <div className="badge badge-soft badge-success">Nouveau</div> : <div className="opacity-0 badge badge-soft badge-success">Nouveau</div>
                        }
                    </div>
                    <p className='textC font-medium'>Outils : {props.outils}</p>
                    <p className='text-xs text-gray-500'>📅 De {props.debut} à {props.fin}   -  💻 {props.nb} place(s) disponibles</p>
                </div>
                <button className='hover:bg-sky-700 bg-sky-600 text-white w-26 h-9 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer'>
                    Voir
                </button>
            </div>
    )
}