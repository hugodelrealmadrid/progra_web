import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAcademico } from '../../context/AcademicoContext';
import { IMG } from '../../data/images';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const EMPTY_ALUMNO = { nombre: '', curso: 'Piano Básico', tipo: 'Cátedra', estado: 'Activo', avatar: IMG.ninos };

export default function ProfesorAlumnos() {
  const location = useLocation();
  const { alumnos, addAlumno, getNotasAlumno, toast } = useAcademico();
  const [buscar, setBuscar] = useState('');
  const [curso, setCurso] = useState(location.state?.curso ?? 'todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [addOpen, setAddOpen] = useState(false);
  const [notasOpen, setNotasOpen] = useState(null);
  const [form, setForm] = useState(EMPTY_ALUMNO);

  const filtrados = useMemo(() => {
    return alumnos.filter((a) => {
      const matchNombre = a.nombre.toLowerCase().includes(buscar.toLowerCase());
      const matchCurso = curso === 'todos' || a.curso === curso;
      const matchEstado = estadoFiltro === 'todos' || a.estado === estadoFiltro;
      return matchNombre && matchCurso && matchEstado;
    });
  }, [alumnos, buscar, curso, estadoFiltro]);

  const handleAgregar = (e) => {
    e.preventDefault();
    addAlumno({ ...form, promedio: 0, progreso: 30 });
    setForm(EMPTY_ALUMNO);
    setAddOpen(false);
  };

  const notasAlumno = notasOpen ? getNotasAlumno(notasOpen.nombre) : [];

  return (
    <div>
      <Toast message={toast} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nómina de Alumnos</h1>
          <p className="mt-1 text-sm text-gray-500">{alumnos.length} estudiantes inscritos en tus cursos</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-lg bg-amc-oscuro px-4 py-2 text-sm font-semibold text-white hover:bg-amc-verde"
        >
          + Agregar alumno
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar alumno por nombre..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm md:min-w-[240px]"
        />
        <select value={curso} onChange={(e) => setCurso(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="todos">Todos los cursos</option>
          <option value="Piano Básico">Piano Básico</option>
          <option value="Piano Avanzado">Piano Avanzado</option>
          <option value="Violín Intermedio">Violín Intermedio</option>
        </select>
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="todos">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Pendiente">Pendiente</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3">Alumno</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Promedio</th>
              <th className="px-4 py-3">Progreso</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a) => (
              <tr key={a.id} className="border-t border-gray-100 even:bg-amc-palido/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={a.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    {a.nombre}
                  </div>
                </td>
                <td className="px-4 py-3">{a.curso}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${a.tipo === 'Especialidad' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {a.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{a.promedio}</td>
                <td className="px-4 py-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${a.progreso >= 80 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${a.progreso}%` }}
                    />
                  </div>
                </td>
                <td className={`px-4 py-3 font-medium ${a.estado === 'Activo' ? 'text-green-600' : 'text-orange-600'}`}>
                  {a.estado}
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setNotasOpen(a)} className="text-xs font-medium text-amc-acento hover:underline">
                    Ver notas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Agregar alumno">
        <form className="space-y-4" onSubmit={handleAgregar}>
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre completo</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Curso</label>
            <select value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option>Piano Básico</option>
              <option>Piano Avanzado</option>
              <option>Violín Intermedio</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option>Cátedra</option>
              <option>Especialidad</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Estado</label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option>Activo</option>
              <option>Pendiente</option>
            </select>
          </div>
          <button type="submit" className="w-full rounded-lg bg-amc-oscuro py-2.5 text-sm font-semibold text-white hover:bg-amc-verde">
            Agregar alumno
          </button>
        </form>
      </Modal>

      <Modal open={!!notasOpen} onClose={() => setNotasOpen(null)} title={`Notas — ${notasOpen?.nombre}`}>
        {notasAlumno.length === 0 ? (
          <p className="text-sm text-gray-500">Sin calificaciones registradas aún.</p>
        ) : (
          <div className="space-y-3">
            {notasAlumno.map((n) => (
              <div key={n.curso} className="rounded-lg border border-gray-200 p-3 text-sm">
                <p className="font-semibold text-amc-oscuro">{n.curso}</p>
                <p>1° Bim: {n.b1 ?? '—'} · 2° Bim: {n.b2 ?? '—'} · 3° Bim: {n.b3 ?? '—'} · 4° Bim: {n.b4 ?? '—'}</p>
                <p className="mt-1 font-bold">Promedio: {n.promedio}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
