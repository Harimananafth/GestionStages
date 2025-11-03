import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = localStorage.getItem("utilisateur");
  const roles = user ? JSON.parse(user).roles : [];

const ApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${ApiUrl}/auth/check`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        // Si la requête réussit, l'utilisateur est connecté
        setIsAuthenticated(true);
      } catch {
        // Si erreur ou pas de token
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen flex justify-center items-center font-semibold">
        Chargement...
      </div>
    );

  return isAuthenticated ? (
    roles.includes("admin") ? (
      <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
    ) : (
      <Navigate to={ROUTES.USER.DASHBOARD} replace />
    )
  ) : (
    children
  );
}
