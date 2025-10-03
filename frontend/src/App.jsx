import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Login from "./components/auth/log-in";
import SignUp from "./components/auth/sign-up";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="auth"> 
          <Route index element={<Login />}/> 
          <Route path="sign-up" element={<SignUp />}/> 
        </Route>
      </Routes>
    </Router>
    
  )
}

export default App
