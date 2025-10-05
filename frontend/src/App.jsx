import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Login from "./components/auth/log-in";
import SignUp from "./components/auth/sign-up";
import Success from "./components/auth/succes";
import SetPassword from "./components/auth/setPassword";
import Verification from "./components/auth/otpVerification";
import MoreInfo from "./components/auth/moreInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="auth"> 
          <Route index element={<Login />}/> 
          <Route path="sign-up" element={<SignUp />}/>
          <Route path="login-success" element={<Success />} />
          <Route path="set-password" element={<SetPassword />} /> 
          <Route path="verification" element={<Verification />} /> 
          <Route path="more-info" element={<MoreInfo />} /> 
        </Route>
      </Routes>
    </Router>
    
  )
}

export default App
