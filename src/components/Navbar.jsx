import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Principal' },
  { to: '/historia', label: 'Sobre la Academia' },
  { to: '/ofertas', label: 'Docentes' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const panelPath =
    user?.rol === 'admin'
      ? '/panel/admin'
      : user?.rol === 'profesor'
        ? '/panel/profesor'
        : '/panel/estudiante';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-amc-verde text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-wide">amc</span>
          <span className="hidden text-[11px] font-normal opacity-90 sm:block">
            Academia Nacional de Musica &quot;Man Cesped&quot;
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:underline ${isActive ? 'underline' : 'opacity-90'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="rounded-lg bg-white px-5 py-2 text-sm font-bold text-amc-verde transition hover:bg-amc-palido"
            >
              INGRESAR
            </Link>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium hover:bg-amc-oscuro"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amc-acento text-xs font-bold">
                  {user.nombre?.charAt(0) ?? 'U'}
                </span>
                <span className="max-w-[140px] truncate">{user.nombre}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 text-gray-800 shadow-card">
                  <p className="border-b border-gray-100 px-4 py-2 text-xs capitalize text-gray-500">
                    Rol: {user.rol}
                  </p>
                  <Link
                    to={panelPath}
                    className="block px-4 py-2 text-sm hover:bg-amc-palido"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Mi panel
                  </Link>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="text-2xl leading-none">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/20 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="rounded-md px-2 py-2 text-sm hover:bg-amc-oscuro"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="mt-2 rounded-lg bg-white px-4 py-2 text-center text-sm font-bold text-amc-verde"
                onClick={() => setMenuOpen(false)}
              >
                INGRESAR
              </Link>
            ) : (
              <>
                <Link
                  to={panelPath}
                  className="mt-2 rounded-lg bg-white px-4 py-2 text-center text-sm font-bold text-amc-verde"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi panel ({user.rol})
                </Link>
                <button
                  type="button"
                  className="rounded-lg border border-white/40 px-4 py-2 text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
