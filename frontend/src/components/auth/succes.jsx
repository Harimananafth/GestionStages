import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "../../routes/paths";

export default function Success() {
    const location = useLocation();
    const navigate = useNavigate(); 

    useEffect(() => {
        document.title = "Connexion réussie"

        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get("id");
        const email = queryParams.get("email");
        const roles = queryParams.get("roles");
        const photo = queryParams.get("photo");


        const parsedRoles = JSON.parse(roles);
        if (id && email && roles) {
            localStorage.setItem("utilisateur", JSON.stringify({ id, email, roles: parsedRoles, photo }));
        }
        
        const timer = setTimeout(() => {
            if (parsedRoles.includes("admin")) {
                navigate(ROUTES.ADMIN.DASHBOARD);
            } else if (parsedRoles.includes("user")) {
                navigate(ROUTES.USER.DASHBOARD);
            } else {
                navigate(ROUTES.HOME); // fallback
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [location.search, navigate]);

    return (
        <h1 className="h-screen flex items-center justify-center text-success font-semibold">Connexion réussie ! Redirection en cours...</h1>
    );
}
