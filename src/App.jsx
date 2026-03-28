import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing/App";
import SignUp from "./pages/signup/App";
import Login from "./pages/login/App";
import Admin from "./pages/admin/App";
import Citizen from "./pages/citizen/App";
import Staff from "./pages/staff/App";

function AppLayout() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/signup" || "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/citizen" element={<Citizen />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;