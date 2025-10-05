import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Success(){
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");
    const email = queryParams.get("email");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get("name");
        const email = queryParams.get("email");

        if (name && email) {
        localStorage.setItem("user", JSON.stringify({ name, email }));
        }
    }, [location.search]);


    return (
        <div>
        <h1>Bienvenue, {name} !</h1>
        <p>Email : {email}</p>
        </div>
    );
}