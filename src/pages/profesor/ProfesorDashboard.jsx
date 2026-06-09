import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAcademico } from '../../context/AcademicoContext';
import Toast from '../../components/Toast';

const ESTADO_STYLE = {
  Completado: 'bg-green-100 text-green-700',
  Pendiente: 'bg-orange-100 text-orange-700',
  Nuevo: 'bg-blue-100 text-blue-700',
};

export default function ProfesorDashboard() {
  const { user } = useAuth();
  const { stats, cursosProfesor, actividad, toast } = useAcademico();
  const nombre = user?.nombre?.split(' ')[0] ?? 'Docente';

  const statCards = [
    { label: 'Cursos Asignados', value: stats.cursos, sub: `${stats.colectivos} colectivos · ${stats.especialidad} especialidad` },
    { label: 'Alumnos Inscritos', value: stats.alumnos, sub: `${stats.activos} activos · ${stats.pendientes} pendientes` },
    { label: 'Calificaciones', value: stats.calificaciones, sub: 'Registros en el sistema' },
    { label: 'Materiales Subidos', value: stats.materiales, sub: 'Disponibles para estudiantes' },
  ];

  return (
    <div>
      <Toast message={toast} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenida, {nombre} 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Gestión académica — {new Date().toLocaleDateString('es-BO')}</p>
        </div>
        <Link
          to="/panel/profesor/calificaciones"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          + Nueva Calificación
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-card">
            <p className="text-2xl font-bold text-amc-oscuro">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{s.label}</p>
            <p className="mt-1 text-xs text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-gray-900">Mis Cursos</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cursosProfesor.map((c, i) => (
          <article key={c.id} className={`overflow-hidden rounded-lg border-2 bg-white shadow-card ${i === 0 ? 'border-amc-acento' : c.color}`}>
            <img src={c.img} alt={c.nombre} className="h-24 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amc-oscuro">{c.nombre}</h3>
                <span className="rounded-full bg-amc-palido px-2 py-0.5 text-xs text-amc-oscuro">{c.tipo}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">{c.horario}</p>
              <div className="mt-3 flex gap-2">
                <Link to="/panel/profesor/calificaciones" className="rounded bg-amc-oscuro px-3 py-1 text-xs font-semibold text-white hover:bg-amc-verde">
                  Calificaciones
                </Link>
                <Link to="/panel/profesor/alumnos" className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50">
                  Alumnos
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-gray-900">Actividad Reciente</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3">Actividad</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {actividad.map((a) => (
              <tr key={a.id} className="border-t border-gray-100 even:bg-amc-palido/30">
                <td className="px-4 py-3">{a.actividad}</td>
                <td className="px-4 py-3">{a.curso}</td>
                <td className="px-4 py-3">{a.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADO_STYLE[a.estado]}`}>
                    {a.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
