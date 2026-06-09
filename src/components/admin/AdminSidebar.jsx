import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/panel/admin', label: 'Inicio', end: true },
  { to: '/panel/admin/cursos', label: 'Cursos' },
  { to: '/panel/admin/usuarios', label: 'Usuarios y roles' },
  { to: '/panel/admin/inscripciones', label: 'Inscripciones' },
  { to: '/panel/admin/pagos', label: 'Pagos' },
  { to: '/panel/admin/mensajes', label: 'Mensajes contacto' },
  { to: '/panel/admin/contenido', label: 'Contenido del sitio' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 bg-amc-palido px-3 py-6 md:w-64">
      <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        Administración
      </p>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-amc-oscuro shadow-sm'
                  : 'text-gray-700 hover:bg-white/60'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
