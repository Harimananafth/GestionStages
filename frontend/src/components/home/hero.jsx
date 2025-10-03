import {Menu, SquareArrowOutUpRight} from 'lucide-react'
import TypingEffect from './typingEffect'

export default function Hero(){
    return (
        <section id='hero' className=" mx-auto min-h-screen  lg:h-screen pt-3 flex flex-col bg-HS lg:px-16 px-10 sm:px-5 animate-[fadeIn_0.5s_ease-in]">

                <header className="flex justify-between items-center pt-3 ">
                    <div className="flex gap-2 items-center hover:cursor-default border-1 border-gray-200 p-2 rounded-xl md:grayscale-100 hover:grayscale-0 hover:-translate-y-1 duration-300">
                        <img src="/images/logo.png" alt="" className="h-6"/>
                        <p className="font-semibold text-lg lg-light">Neovate App</p>
                    </div>
                    <nav className="hidden sm:block">
                    <ul className="textC flex gap-5 text-md font-semibold 2xl:text-xl">
                        <li><a href="#offre" className="nav-link"> Nos offres</a></li>
                        <li><a href="#outil" className="nav-link"> Outils</a></li>
                        <li><a href="#footer" className="nav-link"> Contact</a></li>
                        </ul>
                    </nav>

                   <div className="dropdown dropdown-end block sm:hidden">
                        <Menu strokeWidth={2} size={26} tabIndex={0} color='#2D9CDB' role="button" className=" m-1 hover:cursor-pointer"/>
                        <ul tabIndex={0} className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm textC  font-semibold bg-white">
                            <li><a href="#offre"> Nos offres</a></li>
                            <li><a href="#outil"> Outils</a></li>
                            <li><a href="#footer"> Contact</a></li>
                        </ul>
                    </div>
                </header>


                <div className="grow flex flex-col-reverse lg:flex-row  lg:gap-14 xl:py:0 gap-10 items-center justify-center py-8">
                    <div className='lg:grow flex flex-col  gap-14  sm:gap-20 lg:items-start items-center md:justify-center sm:justify-start lg:justify-start justify-center '>
                        <h1 className=' md:text-[3.5rem] text-3xl px-3 md:px-0 h-[192px] font-medium xl:h-[150px] flex items-center lg:text-left text-center montserrat-hero'> 
                            <TypingEffect text="Trouvez le stage qui lance votre avenir, en quelques clics. "/>
                        </h1>
                        <button className='hover:bg-sky-700 bg-sky-600 flex items-center justify-center gap-4 font-semibold text-lg 2xl:text-xl w-60 h-12  2xl:w-72 2xl:h-14 rounded-full shadow-md hover:-translate-y-1 duration-300 text-white hover:shadow-lg hover:cursor-pointer'>
                            <p>Commencer</p>
                            <SquareArrowOutUpRight strokeWidth={2.75} size={14} />
                        </button> 
                    </div>
                    <div className='min-w-fit xl:h-1/1 h-fit flex items-end justify-end'>
                        <img src="/images/landingpage.png" alt="" className=' h-[250px] sm:h-[320px] md:h-[400px] 2xl:h-[450px] lg:h-[260px] xl:h-[300px] '/>  
                    </div>
                </div>
            </section>
    )
}