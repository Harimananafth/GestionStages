import { useEffect } from "react"
import UserCards from "./userCards"
import Actu from "./actu"

export default function UserDashboard(){
    useEffect(()=>{
        document.title = "Tableau de bord"
    }, [])
    return(
        <div className="flex flex-col gap-3 min-h-full animate-[text-appear-bottom_0.5s_ease-in]">
            <UserCards />
            <Actu />
        </div>
    )
}