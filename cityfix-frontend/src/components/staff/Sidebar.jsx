import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "dashboard", icon: "🏠", label: "My Dashboard" },
  { id: "assigned", icon: "📋", label: "Assigned Issues" },
  { id: "resolved", icon: "✅", label: "Resolved" },
  { id: "map", icon: "📍", label: "Field Map" },
  { id: "alerts", icon: "🔔", label: "Notifications" },
  { id: "profile", icon: "👤", label: "Profile" },
];

const Sidebar = ({ active, setActive }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <aside className="fixed top-0 left-0 z-50 h-screen w-[220px] overflow-y-auto border-r border-cyan-400/10 bg-[#07111f]/95 backdrop-blur-xl">
      <div className="px-5 pt-7 pb-3">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
          Staff
        </span>
      </div>

      <nav className="flex flex-col">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex w-full items-center gap-2.5 border-l-2 px-5 py-3 text-left text-sm transition-all duration-200 ${
              active === item.id
                ? "border-[#19e6d2] bg-cyan-400/10 text-[#e6f1ff] shadow-[inset_0_0_0_1px_rgba(25,230,210,0.04)]"
                : "border-transparent text-[#7c8aa5] hover:bg-cyan-400/5 hover:text-[#e6f1ff]"
            }`}
          >
            <span className="w-5 shrink-0 text-center text-base">{item.icon}</span>
            <span className={active === item.id ? "font-medium" : ""}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-cyan-400/10 bg-[#07111f]/95">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 border-l-2 border-transparent px-5 py-3 text-left text-sm text-[#7c8aa5] transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="w-5 shrink-0 text-center text-base">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;