import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Home />} />
        <Route
          path="auth"
          element={
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          }
        >
          <Route index element={<Login />}/> 
          <Route path="sign-up"> 
              <Route index element={<SignUp />}/>
              <Route path="set-password" element={<SetPassword />} /> 
              <Route path="verification" element={<Verification />} /> 
              <Route path="more-info" element={<MoreInfo />} /> 
          </Route>
          <Route path="login-success" element={<Success />} />
        </Route>
        {/* Route user simple */}
        <Route
          path="t"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<UserDashboard />} />
        </Route>
        {/* Route admin */}
        <Route
          path="a"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
    
  )
}

export default App
