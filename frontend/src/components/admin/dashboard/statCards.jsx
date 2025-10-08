import { FileUser, CalendarDays, BriefcaseBusiness, UserCheck } from "lucide-react"
export default function StatCards(){
    return(
        <div className="h-fit grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-2 justify-center md:justify-start md:items-center items-start md:gap-8">
                <FileUser strokeWidth={1.5} className="text-yellow-500 w-8 h-8 md:w-12 md:h-12" />
                <div className="grid grid-rows-2 md:gap-2">
                    <h2 className="text-2xl font-bold sm:text-3xl">150</h2>
                    <p className="text-sm text-[#4F5D75] sm:text-md">Nombre totale de candidature</p>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-2 justify-center md:justify-start md:items-center items-start md:gap-8">
                <CalendarDays strokeWidth={1.5} className="text-purple-500 w-8 h-8 md:w-12 md:h-12" />
                <div className="grid grid-rows-2 md:gap-2">
                    <h2 className="text-2xl font-bold sm:text-3xl">33</h2>
                    <p className="text-sm text-[#4F5D75] sm:text-md">Nombre de candidature cette année</p>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-2 justify-center md:justify-start md:items-center items-start md:gap-8">
                <BriefcaseBusiness strokeWidth={1.5} className="text-emerald-500 w-8 h-8 md:w-12 md:h-12" />
                <div className="grid grid-rows-2 md:gap-2">
                    <h2 className="text-2xl font-bold sm:text-3xl">10</h2>
                    <p className="text-sm text-[#4F5D75] sm:text-md">Nombre totale d'offre</p>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-2 justify-center md:justify-start md:items-center items-start md:gap-8">
                <UserCheck strokeWidth={1.5} className="text-pink-500 w-8 h-8 md:w-12 md:h-12" />
                <div className="grid grid-rows-2 md:gap-2">
                    <h2 className="text-2xl font-bold sm:text-3xl">150</h2>
                    <p className="text-sm text-[#4F5D75] sm:text-md">Nombre totale d'étudiants</p>
                </div>
            </div>
            
        </div>
    )
}