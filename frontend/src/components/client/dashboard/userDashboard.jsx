import { useEffect } from "react"

export default function UserDashboard(){
    useEffect(()=>{
        document.title = "Dashboard"
    }, [])
    return(
        <h1>User dashboard</h1>
    )
}