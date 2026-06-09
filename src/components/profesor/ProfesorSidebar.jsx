import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAcademico } from '../../context/AcademicoContext';
import { PERFIL_PROFESOR } from '../../data/profesorMock';

const LINKS = [
  { to: '/panel/profesor', label: 'Panel General', end: true, section: 'Principal' },
  { to: '/panel/profesor/cursos', label: 'Mis Cursos', badgeKey: 'cursos' },
  { to: '/panel/profesor/alumnos', label: 'Nómina de Alumnos', badgeKey: 'alumnos' },
  { section: 'Evaluación' },
  { to: '/panel/profesor/calificaciones', label: 'Calificaciones' },
  { to: '/panel/profesor/informes', label: 'Informes Especialidad' },
  { section: 'Recursos' },
  { to: '/panel/profesor/materiales', label: 'Materiales', badgeKey: 'materiales' },
];

export default function ProfesorSidebar() {
  const { user, logout } = useAuth();
  const { stats } = useAcademico();
  const perfil = user ?? PERFIL_PROFESOR;

  const getBadge = (key) => {
    if (key === 'cursos') return stats.cursos;
    if (key === 'alumnos') return stats.alumnos;
    if (key === 'materiales') return stats.materiales;
    return null;
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col bg-[#1a2e26] text-white md:w-64">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <img
            src={perfil.avatar ?? PERFIL_PROFESOR.avatar}
            alt=""
            className="h-12 w-12 rounded-full border-2 border-amc-acento object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{perfil.nombre ?? PERFIL_PROFESOR.nombre}</p>
            <p className="text-xs text-[#9CCB7B]">Docente</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {LINKS.map((link, i) =>
          link.section ? (
            <p key={link.section} className={`px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 ${i > 0 ? 'mt-4' : ''}`}>
              {link.section}
            </p>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-amc-acento text-white' : 'text-gray-300 hover:bg-white/10'
                }`
              }
            >
              {link.label}
              {link.badgeKey && (
                <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-gray-900">
                  {getBadge(link.badgeKey)}
                </span>
              )}
            </NavLink>
          )
        )}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="m-3 rounded-md border border-white/20 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-white/10"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
