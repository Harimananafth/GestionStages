import CardLanding from "./cardLanding"

export default  function Echantillon(){
    return(
        
            <section className="h-screen relative pt-30 pb-3 lg:px-16 px-5 bg-[#F2F4F7]">

                <svg className="absolute w-1/1 h-[100px] top-[-1px] left-0"  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 100"><g fill="#E9F3FF"><path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path></g></svg>

                <div className='flex flex-col gap-16 h-1/1 items-center'>
                    <h1 className='text-3xl text-black font-bold text-center upEntry'>Quelques offres </h1>
                    <div className='grow flex flex-col gap-7 justify-start items-center '>
                        <CardLanding titre="Stage" isNew={true} outils="Nodejs" debut="janvier" fin="avril" nb={2} />
                    </div>
                    <button className='scale hover:bg-sky-700 bg-sky-600 text-white w-45 h-9 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer'>
                        Voir toutes les offres
                    </button>
                </div>
            </section>
    )
}