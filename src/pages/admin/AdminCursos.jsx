import { useState } from 'react';
import { IMG } from '../../data/images';
import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/admin/StatusBadge';

const EMPTY = {
  codigo: '',
  nombre: '',
  nivel: '',
  profesor: '',
  cuposOcupados: 0,
  cuposTotal: 20,
  estado: 'Activo',
  img: IMG.piano,
  descripcion: '',
  destacado: true,
};

export default function AdminCursos() {
  const { cursos, addCurso, updateCurso, deleteCurso } = useAdminData();
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
  };

  const handleEdit = (curso) => {
    setEditId(curso.id);
    setForm({
      codigo: curso.codigo,
      nombre: curso.nombre,
      nivel: curso.nivel,
      profesor: curso.profesor,
      cuposOcupados: curso.cuposOcupados,
      cuposTotal: curso.cuposTotal,
      estado: curso.estado,
      img: curso.img,
      descripcion: curso.descripcion || '',
      destacado: curso.destacado ?? true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) updateCurso(editId, form);
    else addCurso(form);
    resetForm();
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, img: URL.createObjectURL(file) }));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de cursos</h1>
        <button
          type="button"
          onClick={resetForm}
          className="rounded-lg bg-amc-oscuro px-4 py-2 text-sm font-semibold text-white hover:bg-amc-verde"
        >
          + Nuevo curso
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3 font-semibold">Imagen</th>
              <th className="px-4 py-3 font-semibold">Código</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Nivel</th>
              <th className="px-4 py-3 font-semibold">Profesor</th>
              <th className="px-4 py-3 font-semibold">Cupos</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                <td className="px-4 py-3">
                  <img src={curso.img} alt={curso.nombre} className="h-12 w-16 rounded object-cover" />
                </td>
                <td className="px-4 py-3">{curso.codigo}</td>
                <td className="px-4 py-3 font-medium">{curso.nombre}</td>
                <td className="px-4 py-3">{curso.nivel}</td>
                <td className="px-4 py-3">{curso.profesor}</td>
                <td className="px-4 py-3">{curso.cuposOcupados}/{curso.cuposTotal}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={curso.estado} type="activo" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(curso)} className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-50">
                      Editar
                    </button>
                    <button type="button" onClick={() => deleteCurso(curso.id)} className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-amc-oscuro">{editId ? 'Editar curso' : 'Formulario curso'}</h2>
        <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Código</label>
            <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nivel</label>
            <input value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Profesor</label>
            <input value={form.profesor} onChange={(e) => setForm({ ...form, profesor: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cupos totales</label>
            <input type="number" value={form.cuposTotal} onChange={(e) => setForm({ ...form, cuposTotal: Number(e.target.value) })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cupos ocupados</label>
            <input type="number" value={form.cuposOcupados} onChange={(e) => setForm({ ...form, cuposOcupados: Number(e.target.value) })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripción (visible en página principal)</label>
            <textarea
              rows={2}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Imagen del curso</label>
            <input type="file" accept="image/*" onChange={handleImage} className="w-full text-sm text-gray-600" />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="rounded-lg bg-amc-oscuro px-5 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
              Guardar
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-amc-verde px-5 py-2 text-sm font-semibold text-amc-verde hover:bg-amc-palido">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
