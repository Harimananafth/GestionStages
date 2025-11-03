import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const ApiUrl =
    import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${ApiUrl}/auth/check`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        if (
          allowedRoles &&
          !allowedRoles.some((r) => data.user.roles.includes(r))
        ) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading)
    return (
      <div className="h-screen w-screen flex justify-center items-center font-semibold">
        Chargement...
      </div>
    );
  return authorized ? children : <Navigate to={ROUTES.AUTH.LOGIN} replace />;
}
