export default function Notification({data, error}){
    if (error) return <li> <p className="text-xs font-semibold text-error" >Erreur de chargement </p> </li>
    if (data.data.length ===  0) return <li> <p className='text-md font-semibold text-gray-500 p-4 flex justify-center items-center text-center' >Aucune notification </p> </li>

    return (
        data.data.map((notification) => (
            <li key={notification.id} className={`${notification.lu ? "bg-white" : "bg-blue-50"} border-b border-b-gray-50 border-r-4 border-r-sky-600 px-4 py-2 rounded-tl-lg rounded-bl-lg mb-1`}>
                <a className="text-sm font-semibold text-gray-600 hover:bg-gray-100 flex flex-col justify-center items-end">
                    <p>{notification.message}</p>
                    <span className="text-[10px] font-normal text-gray-400">{new Date(notification.date_reception).toLocaleString()}</span>
                </a>
            </li>
        )
    )
)
    
}