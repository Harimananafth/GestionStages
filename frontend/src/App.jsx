import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/home";
import Login from "./components/auth/log-in";
import SignUp from "./components/auth/sign-up";
import Success from "./components/auth/succes";
import SetPassword from "./components/auth/setPassword";
import Verification from "./components/auth/otpVerification";
import MoreInfo from "./components/auth/moreInfo";
import ProtectedRoute from "./components/auth/protectedRoute";
import UserDashboard from "./components/client/dashboard/userDashboard";
import UserLayout from "./components/client/userLayout";
import AdminDashboard from "./components/admin/dashboard/adminDashboard";
import AdminLayout from "./components/admin/adminLayout";
import PublicRoute from "./components/auth/publicRoute";
import { ROUTES } from "./routes/paths";
import MainAdminOffre from "./components/admin/offre/mainOffre";
import OffreCandidature from "./components/admin/offre/offreCandidature";
import ActionOnCandidature from "./components/admin/candidature/actionOnCandidature";
import MainAdminCandidatures from "./components/admin/candidature/mainCandidature";
import MainAdminEtudiant from "./components/admin/etudiant/mainEtudiant";
import FicheEtudiant from "./components/admin/etudiant/ficheEtudiant";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path={ROUTES.HOME} element={<Home />} />

        {/* Authentification publique */}
        <Route
          path={ROUTES.AUTH.ROOT}
          element={
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          }
        >
          <Route index element={<Login />} />

          <Route path="sign-up">
            <Route index element={<SignUp />} />
            <Route path="set-password" element={<SetPassword />} />
            <Route path="verification" element={<Verification />} />
            <Route path="more-info" element={<MoreInfo />} />
          </Route>

          <Route path="login-success" element={<Success />} />
        </Route>

        {/* Espace utilisateur */}
        <Route
          path={ROUTES.USER.ROOT}
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
        </Route>

        {/* Espace admin */}
        <Route
          path={ROUTES.ADMIN.ROOT}
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="offres" element={<MainAdminOffre />} />
          <Route path="offres/:id" element={<OffreCandidature />} />
          <Route path="candidatures/:id" element={<ActionOnCandidature />} />
          <Route path="candidatures" element={<MainAdminCandidatures />} />
          <Route path="etudiants" element={<MainAdminEtudiant />} />
          <Route path="etudiants/:id" element={<FicheEtudiant />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
