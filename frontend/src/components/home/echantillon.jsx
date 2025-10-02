import useSWR from 'swr'
import OffresList from './offresList';

const API_URL = "http://localhost:5000";
const fetcher = (...args) => fetch(...args).then(res => res.json())


export default  function Echantillon(){
    
    const { data, error, isLoading } = useSWR(`http://localhost:5000/api/offre/?limit=3`, fetcher)

    return(
        
            <section id='offre' className="min-h-screen flex justify-center relative pt-30 md:pb-8 pb-6 lg:px-16 px-5 bg-[#F2F4F7]">

                <svg className="absolute w-1/1 h-[100px] top-[-1px] left-0"  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 100"><g fill="#E9F3FF"><path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path></g></svg>

                <div className='flex flex-col gap-16  items-center'>
                    <h1 className='text-3xl font-bold text-gray-800 text-center upEntry'>Nos offres </h1>
                    {isLoading ? (
                            <span className="loading loading-dots loading-xl grow"></span>
                        ) : (
                            <OffresList data = {data} error={error} />
                        )
                    }
                    <button className='scale hover:bg-sky-700 bg-sky-600 text-white w-45 h-9 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer'>
                        Voir toutes les offres
                    </button>


                </div>
                
            </section>
    )
}