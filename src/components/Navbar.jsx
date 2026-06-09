import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoAMC from '../assets/logo-amc.png';

const navLinks = [
  { to: '/', label: 'Principal' },
  { to: '/historia', label: 'Sobre la Academia' },
  { to: '/ofertas', label: 'Oferta Academica' },
  { to: '/contacto', label: 'Contacto' },
];

const PANEL_CONFIG = {
  admin: { title: 'Panel de Administración', home: '/panel/admin' },
  estudiante: { title: 'Panel del Estudiante', home: '/panel/estudiante' },
  profesor: { title: 'Panel del Docente', home: '/panel/profesor' },
};

export default function Navbar({ variant = 'public' }) {
  const { user, logout, rolLabel } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const panel = PANEL_CONFIG[variant];
  const isPanel = Boolean(panel);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ProfileMenu = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setUserMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-white/25 bg-black/20 px-3 py-2 text-sm"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-green-600 text-xs font-bold">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            user?.nombre?.charAt(0) ?? 'U'
          )}
        </span>
        <span className="max-w-[140px] truncate">{user?.nombre ?? 'Usuario'}</span>
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 text-gray-800 shadow-lg">
          <p className="border-b px-4 py-2 text-xs text-gray-500">{rolLabel}</p>
          <Link
            to="/"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setUserMenuOpen(false)}
          >
            Ver sitio público
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
  );

  return (
    <header className="bg-[#202629] text-white shadow-md">
      <div className="mx-auto flex h-[110px] w-full max-w-[1440px] items-center justify-between px-8">
        <Link to={isPanel ? panel.home : '/'} className="flex flex-col items-center justify-center">
          <img src={logoAMC} alt="Academia AMC" className="h-[90px] w-auto object-contain" />
          <span className="mt-2 whitespace-nowrap text-center text-[12px] font-medium text-[#9CCB7B]">
            Academia Nacional de Música &quot;Man Césped&quot;
          </span>
        </Link>

        {!isPanel ? (
          <>
            <nav className="hidden items-center gap-10 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-sm transition ${
                      isActive ? 'font-semibold text-white' : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden lg:flex">
              <Link
                to="/login"
                className="rounded bg-[#4CAF50] px-5 py-2 text-xs font-bold tracking-wide text-white transition hover:bg-[#43a047]"
              >
                INGRESAR
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="hidden text-sm font-medium text-gray-300 lg:block">{panel.title}</p>
            <div className="hidden lg:flex">
              <ProfileMenu />
            </div>
          </>
        )}

        <button
          type="button"
          className="rounded p-2 lg:hidden"
          aria-label="Menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="text-2xl">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/20 px-6 py-4 lg:hidden">
          {!isPanel ? (
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className="rounded px-2 py-2 text-sm hover:bg-black/20"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/login"
                className="mt-2 rounded bg-[#4CAF50] py-2 text-center text-sm font-bold"
                onClick={() => setMenuOpen(false)}
              >
                INGRESAR
              </Link>
            </nav>
          ) : (
            <div className="space-y-2">
              <p className="px-2 text-sm text-gray-300">{user?.nombre}</p>
              <p className="px-2 text-xs text-gray-400">{panel.title}</p>
              <Link to="/" className="block rounded px-2 py-2 text-sm hover:bg-black/20" onClick={() => setMenuOpen(false)}>
                Ver sitio público
              </Link>
              <button
                type="button"
                className="w-full rounded px-2 py-2 text-left text-sm text-red-300 hover:bg-black/20"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
