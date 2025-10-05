import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Success() {
    const location = useLocation();
    const navigate = useNavigate(); // ✅ parenthèses manquantes

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get("id");
        const email = queryParams.get("email");
        const roles = queryParams.get("roles");

        if (id && email && roles) {
            localStorage.setItem("user", JSON.stringify({ id, email, roles: JSON.parse(roles) }));
        }
        
        const timer = setTimeout(() => {
            navigate("/t/");
        }, 1000);

        return () => clearTimeout(timer);
    }, [location.search, navigate]);

    return (
        <h1 className="h-screen flex items-center justify-center text-success font-semibold">Connexion réussie ! Redirection en cours...</h1>
    );
}
