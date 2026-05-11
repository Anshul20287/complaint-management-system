import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import navLinks from '../../data/navLinks';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useNavbarScroll } from '../../hooks/useNavbarScroll';

const SECTION_IDS = ['home', 'about', 'features', 'howitworks', 'contact'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useNavbarScroll(40);
  const activeId = useScrollSpy(SECTION_IDS);
  const navigate = useNavigate();

  const navBg = scrolled
    ? 'bg-bg/95 backdrop-blur-xl border-b border-white/[0.07]'
    : 'bg-bg/90 backdrop-blur-xl border-b border-white/[0.07]';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[68px] transition-all duration-300 ${navBg}`}>

      <a href="/#home" className="font-syne font-extrabold text-[1.4rem] text-[#e8edf8] no-underline">
        City<span className="text-accent">Fix</span>
      </a>

      <ul className="hidden md:flex gap-8 list-none">
        {navLinks.map(({ label, href }) => {
          const id = href.replace('#', '');
          const isActive = activeId === id;

          return (
            <li key={href}>
              <a
                href={`/${href}`}
                className={`text-sm no-underline transition-colors duration-200 ${
                  isActive ? 'text-accent' : 'text-muted hover:text-accent'
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2.5">
        <button
          className="hidden sm:block px-5 py-2 rounded-lg text-sm border border-white/[0.07] bg-transparent text-muted cursor-pointer transition-all hover:border-accent hover:text-accent"
          onClick={() => navigate('/login')}
        >
          Login
        </button>

        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-accent text-bg border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,245,212,0.3)]"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>

        <button
          className="md:hidden ml-1 text-muted text-xl leading-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute top-[68px] left-0 right-0 flex flex-col py-4 px-6 gap-4 md:hidden"
          style={{
            background: 'rgba(3,6,15,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={`/${href}`}
              className="text-muted text-sm py-1 hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}