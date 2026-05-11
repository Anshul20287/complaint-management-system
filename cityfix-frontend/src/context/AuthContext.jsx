import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedDomain = localStorage.getItem('selectedDomain');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        login(parsedUser);
        if (savedDomain) {
          setSelectedDomain(savedDomain);
        }
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('selectedDomain');
      }
    }
  }, []);

  function login(userData) {
    if (!userData) return;
    const username = userData.username || userData.name || '';
    setUser({ ...userData, username, role: userData.role || 'citizen' });
  }

  function selectDomain(domain) {
    setSelectedDomain(domain);
    localStorage.setItem('selectedDomain', domain);
  }

  function logout() {
    setUser(null);
    setSelectedDomain(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedDomain');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user, selectedDomain, selectDomain }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
