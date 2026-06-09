import { useMemo, useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminInscripciones() {
  const { inscripciones } = useAdminData();
  const [filtroCurso, setFiltroCurso] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const filtradas = useMemo(() => {
    return inscripciones.filter((i) => {
      const matchCurso = filtroCurso === 'todos' || i.curso === filtroCurso;
      const matchEstado = filtroEstado === 'todos' || i.estado === filtroEstado;
      return matchCurso && matchEstado;
    });
  }, [inscripciones, filtroCurso, filtroEstado]);

  const cursos = [...new Set(inscripciones.map((i) => i.curso))];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Inscripciones</h1>

      <div className="mt-5 flex flex-wrap gap-3">
        <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="todos">Todos los cursos</option>
          {cursos.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="todos">Todos los estados</option>
          <option value="Confirmado">Confirmado</option>
          <option value="En revisión">En revisión</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3 font-semibold">Estudiante</th>
              <th className="px-4 py-3 font-semibold">Curso</th>
              <th className="px-4 py-3 font-semibold">Nivel</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Pago</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={row.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    {row.estudiante}
                  </div>
                </td>
                <td className="px-4 py-3">{row.curso}</td>
                <td className="px-4 py-3">{row.nivel}</td>
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
  );
}
