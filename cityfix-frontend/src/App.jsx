import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import LiveMap from "./components/LiveMap/Livemap.jsx";
import Landing from "./pages/Landing/App";
import SignUp from "./pages/signup/App";
import Login from "./pages/login/App";
import Admin from "./pages/admin/App";
import Citizen from "./pages/citizen/App";
import Staff from "./pages/staff/App";
import DomainSelect from "./pages/staff/DomainSelect";

function AppLayout() {
  const location = useLocation();

 const hideNavbar =
  location.pathname === "/signup" || location.pathname === "/login" || location.pathname === "/staff/domain-select";

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
        <Route path="/staff/domain-select" element={<DomainSelect />} />
        <Route path="/live-map" element={<LiveMap />} />
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