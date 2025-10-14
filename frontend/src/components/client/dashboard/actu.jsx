import useSWR from 'swr'


const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function Actu(){
    const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
    const { data, error, isLoading } = useSWR(`${ApiUrl}/notification`, fetcher);

    return (
        <div className="bg-white rounded-xl shadow-md grow hover:scale-1.8 hover:cursor-default hover:shadow-lg duration-300 p-7 flex flex-col justify-center items-start gap-5">
            <h1 className="montserrat-hero font-bold text-xl">Actualités</h1>
            <div className="grow flex flex-col gap-2 overflow-y-auto w-full">
                {error && <p className='text-error text-sm'>Erreur lors du chargement</p>}
                {isLoading ? (
                        <span className="loading loading-dots loading-xl grow"></span>
                    ) : (
                        data?.data?.map(actu => {
                            const message = actu.message
                            const [titre, details] = message.split(". ")
                            const date = new Date(actu.date_reception).toLocaleDateString()
                            return(
                                <div key={actu.id} className="flex flex-col gap-3 md:gap-1 rounded-tr-xl rounded-br-xl p-4 md:p-5 border-l-4 border-sky-500 bg-sky-100">
                                    <h1 className="font-semibold text-lg">{titre}</h1>
                                    <div className="flex flex-col items-start gap-1 md:flex-row md:justify-between md:items-center label text-xs text-gray-400">
                                        <p className='grow'>{details}</p>
                                        <small> {date}</small>
                                    </div>
                                </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}