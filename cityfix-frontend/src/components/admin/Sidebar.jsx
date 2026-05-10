import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'issues', icon: '📋', label: 'All Issues' },
  { id: 'citizens', icon: '👥', label: 'Citizens' },
  { id: 'staff', icon: '🧑‍💼', label: 'Staff' },
  { id: 'map', icon: '📍', label: 'Map View' },
  { id: 'announcements', icon: '📣', label: 'Announcements' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

const Sidebar = ({ activeNav, setActiveNav }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <aside className="fixed left-0 top-0 z-50 w-[220px] h-screen overflow-y-auto border-r border-cyan-400/10 bg-[#07111f]/95 backdrop-blur-xl">
      <div className="px-5 pt-7 pb-3">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
          Admin
        </span>
      </div>

      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex w-full items-center gap-2.5 border-l-2 px-5 py-3 text-left text-sm transition-all duration-200 ${
                isActive
                  ? 'border-[#19e6d2] bg-cyan-400/10 text-[#e6f1ff] shadow-[inset_0_0_0_1px_rgba(25,230,210,0.04)]'
                  : 'border-transparent text-[#7c8aa5] hover:bg-cyan-400/5 hover:text-[#e6f1ff]'
              }`}
            >
              <span className="w-5 shrink-0 text-center text-base">
                {item.icon}
              </span>
              <span className={isActive ? 'font-medium' : ''}>
                {item.label}
              </span>
            </button>
          );
        })}
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