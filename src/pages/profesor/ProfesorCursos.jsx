import { Link } from 'react-router-dom';
import { useAcademico } from '../../context/AcademicoContext';
import Toast from '../../components/Toast';

export default function ProfesorCursos() {
  const { cursosProfesor, alumnos, toast } = useAcademico();

  const alumnosPorCurso = (nombreCurso) => alumnos.filter((a) => a.curso === nombreCurso).length;

  return (
    <div>
      <Toast message={toast} />

      <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
      <p className="mt-1 text-sm text-gray-500">Cursos asignados por el administrador</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cursosProfesor.map((c) => (
          <article key={c.id} className={`overflow-hidden rounded-lg border-t-4 bg-white shadow-card ${c.color.replace('border-', 'border-t-')}`}>
            <img src={c.img} alt={c.nombre} className="h-32 w-full object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-amc-oscuro">{c.nombre}</h3>
              <p className="text-sm text-gray-500">{c.tipo} · {c.horario}</p>
              <div className="mt-3 flex gap-4 text-xs font-semibold text-gray-600">
                <span>{alumnosPorCurso(c.nombre) || c.alumnos} ALUMNOS</span>
                <span>{c.duracion.toUpperCase()}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/panel/profesor/calificaciones"
                  state={{ curso: c.nombre }}
                  className="rounded bg-amc-oscuro px-3 py-1.5 text-xs font-semibold text-white hover:bg-amc-verde"
                >
                  Calificaciones
                </Link>
                <Link
                  to="/panel/profesor/alumnos"
                  state={{ curso: c.nombre }}
                  className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                >
                  Alumnos
                </Link>
                {c.tipo === 'Especialidad' && (
                  <Link to="/panel/profesor/informes" className="rounded border border-blue-300 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50">
                    Informes
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-gray-900">Resumen de Avance</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Alumnos</th>
              <th className="px-4 py-3">1° BIM</th>
              <th className="px-4 py-3">2° BIM</th>
              <th className="px-4 py-3">3° BIM</th>
              <th className="px-4 py-3">4° BIM</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cursosProfesor.map((c) => (
              <tr key={c.id} className="border-t border-gray-100 even:bg-amc-palido/30">
                <td className="px-4 py-3 font-medium">{c.nombre}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${c.tipo === 'Colectivo' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {c.tipo}
                  </span>
                </td>
                <td className="px-4 py-3">{alumnosPorCurso(c.nombre) || c.alumnos}</td>
                <td className="px-4 py-3 text-green-600">✓</td>
                <td className="px-4 py-3 text-green-600">✓</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 font-medium text-amc-acento">En curso</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
