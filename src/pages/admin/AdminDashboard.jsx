import { IMG } from '../../data/images';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/admin/StatusBadge';

const STAT_IMGS = [IMG.piano, IMG.director, IMG.orquesta, IMG.concierto];

export default function AdminDashboard() {
  const { users } = useAuth();
  const { stats, inscripciones } = useAdminData();

  const cards = [
    { label: 'Cursos activos', value: stats.cursos },
    { label: 'Usuarios', value: users.length },
    { label: 'Inscripciones', value: stats.inscripciones },
    { label: 'Mensajes nuevos', value: stats.mensajes },
  ];

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-lg">
        <img src={IMG.orquesta} alt="Panel AMC" className="h-40 w-full object-cover md:h-48" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Panel de administración</h1>
            <p className="mt-1 text-sm text-white/90">Resumen general — Gestión 2024</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat, i) => (
          <div key={stat.label} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-card">
            <img src={STAT_IMGS[i]} alt="" className="h-20 w-full object-cover" />
            <div className="p-5">
              <p className="text-3xl font-bold text-amc-acento">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Inscripciones recientes</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="bg-amc-oscuro text-white">
                <th className="px-4 py-3 font-semibold">Estudiante</th>
                <th className="px-4 py-3 font-semibold">Curso</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Pago</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={row.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      {row.estudiante}
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.curso}</td>
                  <td className="px-4 py-3">{row.fecha}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={row.pago} />
                  </td>
                  <td className="px-4 py-3">{row.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
