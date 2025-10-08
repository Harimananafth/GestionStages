import StatCards from "./statCards"

export default function AdminDashboard(){
    return(
        <div className="flex flex-col gap-3 min-h-full md:overflow-y-scroll animate-[text-appear-bottom_0.5s_ease-in]">
            <StatCards />
            <div className="bg-white rounded-xl grow">

            </div>
        </div>
    )
}