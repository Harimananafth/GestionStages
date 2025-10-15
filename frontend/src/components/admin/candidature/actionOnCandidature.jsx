import { useLocation } from "react-router-dom";

export default function ActionOnCandidature(){
    const location = useLocation();

    const titre = location.state?.titre || '';

    return (
        <div>
            Action sur une candidature pour : {titre}
        </div>
    )
}