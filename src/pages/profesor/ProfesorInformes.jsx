import { useState } from 'react';
import { useAcademico } from '../../context/AcademicoContext';
import { IMG } from '../../data/images';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const EMPTY = { alumno: '', clase: '', contenido: '', observaciones: '', nota: 80, avatar: IMG.piano };

export default function ProfesorInformes() {
  const { informes, addInforme, updateInforme, deleteInforme, alumnos, toast } = useAcademico();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const abrirNuevo = () => {
    setEditId(null);
    setForm(EMPTY);
    setFormOpen(true);
  };

  const abrirEditar = (inf) => {
    setEditId(inf.id);
    setForm({ alumno: inf.alumno, clase: inf.clase, contenido: inf.contenido, observaciones: inf.observaciones, nota: inf.nota, avatar: inf.avatar });
    setFormOpen(true);
  };

  const guardar = (e) => {
    e.preventDefault();
    const alumnoData = alumnos.find((a) => a.nombre === form.alumno);
    const payload = { ...form, avatar: alumnoData?.avatar ?? form.avatar, nota: Number(form.nota) };
    if (editId) updateInforme(editId, payload);
    else addInforme(payload);
    setFormOpen(false);
  };

  return (
    <div>
      <Toast message={toast} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes de Especialidad</h1>
          <p className="mt-1 text-sm text-gray-500">Piano Avanzado — Registro por clase con observaciones y nota parcial</p>
        </div>
        <button type="button" onClick={abrirNuevo} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
          + Nuevo Informe
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-card">
        <div className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-800">
          Historial de Informes
        </div>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3">Alumno</th>
              <th className="px-4 py-3">Clase</th>
              <th className="px-4 py-3">Contenido</th>
              <th className="px-4 py-3">Observaciones</th>
              <th className="px-4 py-3">Nota</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((inf) => (
              <tr key={inf.id} className="border-t border-gray-100 even:bg-amc-palido/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={inf.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    {inf.alumno}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {inf.clase}
                  </span>
                </td>
                <td className="px-4 py-3">{inf.contenido}</td>
                <td className="px-4 py-3 text-gray-600">{inf.observaciones}</td>
                <td className="px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amc-acento text-sm font-bold text-amc-oscuro">
                    {inf.nota}
                  </span>
                </td>
                <td className="px-4 py-3">{inf.fecha}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => abrirEditar(inf)} className="text-xs text-amc-acento hover:underline">Editar</button>
                    <button type="button" onClick={() => deleteInforme(inf.id)} className="text-xs text-red-500 hover:underline">Borrar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editId ? 'Editar informe' : 'Nuevo informe'}>
        <form className="space-y-4" onSubmit={guardar}>
          <div>
            <label className="mb-1 block text-sm font-medium">Alumno</label>
            <select value={form.alumno} onChange={(e) => setForm({ ...form, alumno: e.target.value })} required className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">Seleccionar...</option>
              {alumnos.filter((a) => a.tipo === 'Especialidad').map((a) => (
                <option key={a.id} value={a.nombre}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Clase</label>
            <input value={form.clase} onChange={(e) => setForm({ ...form, clase: e.target.value })} placeholder="Clase 10" required className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Contenido</label>
            <input value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} required className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Observaciones</label>
            <textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nota (0-100)</label>
            <input type="number" min={0} max={100} value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} required className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-amc-oscuro py-2.5 text-sm font-semibold text-white hover:bg-amc-verde">
            {editId ? 'Actualizar informe' : 'Crear informe'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
