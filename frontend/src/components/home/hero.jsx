import {Menu, CircleChevronRight} from 'lucide-react'
import TypingEffect from '../components/typingEffect'

export default function Hero(){
    return (
        <section className=" mx-auto h-screen pt-3 flex flex-col bg-HS lg:px-16 px-5 animate-[fadeIn_0.5s_ease-in]">

                <header className="flex justify-between items-center pt-1 ">
                    <div className="flex gap-2 items-center border-1 border-gray-200 p-2 hover:cursor-default rounded-xl md:grayscale-100 hover:grayscale-0 hover:-translate-y-1 duration-300">
                        <img src="/images/logo.png" alt="" className="h-5"/>
                        <p className="font-semibold text-lg lg-light">Neovate App</p>
                    </div>
                    <nav className="hidden sm:block">
                    <ul className="textC flex gap-5 text-md font-semibold 2xl:text-xl">
                        <li><a href="#" className="nav-link"> Offre récentes</a></li>
                        <li><a href="#" className="nav-link"> Contact</a></li>
                        </ul>
                    </nav>

                   <div className="dropdown dropdown-end block sm:hidden">
                        <Menu strokeWidth={2} size={26} tabIndex={0} color='#2D9CDB' role="button" className=" m-1 hover:cursor-pointer"/>
                        <ul tabIndex={0} className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm textC  font-semibold bg-white">
                            <li><a href="#"> Offre récentes</a></li>
                            <li><a href="#"> Contact</a></li>
                        </ul>
                    </div>
                </header>


                <div className="grow flex flex-col-reverse xl:flex-row  xl:gap-14 xl:py:0 gap-10 md:justify-start items-center justify-center py-8 upEntry">
                    <div className='grow flex flex-col  gap-14  sm:gap-20 xl:items-start items-center md:justify-center sm:justify-start justify-center'>
                        <h1 className='text-black lg:text-[4rem] text-5xl h-[192px] font-bold xl:h-[150px] flex items-center xl:text-left text-center'>
                            <TypingEffect text="Trouvez le stage qui lance votre avenir, en un clic. "/>
                        </h1>
                        <button className='hover:bg-sky-700 bg-sky-600 flex items-center justify-center gap-6 font-semibold text-lg w-60 h-14 rounded-full shadow-md hover:-translate-y-1 duration-300 text-white hover:shadow-lg hover:cursor-pointer'>
                            Commencer
                            <CircleChevronRight strokeWidth={2} />
                        </button> 
                    </div>
                    <div className='min-w-fit xl:h-1/1 h-fit flex items-end justify-end'>
                        <img src="/images/landingpage.png" alt="" className=' sm:h-[320px] h-[280px] 2xl:h-[500px]'/>  
                    </div>
                </div>
            </section>
    )
}