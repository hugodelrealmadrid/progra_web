import { useRef, useState } from 'react';
import { useAcademico } from '../../context/AcademicoContext';
import Toast from '../../components/Toast';

export default function ProfesorMateriales() {
  const { materiales, addMaterial, deleteMaterial, downloadMaterial, toast } = useAcademico();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ curso: 'Piano Básico', titulo: '', categoria: 'Partitura', tamano: '' });
  const [archivoNombre, setArchivoNombre] = useState('');

  const seleccionarArchivo = () => fileRef.current?.click();

  const onArchivo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoNombre(file.name);
    setForm((f) => ({
      ...f,
      titulo: f.titulo || file.name,
      tamano: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    }));
  };

  const subir = (e) => {
    e.preventDefault();
    if (!form.titulo) return;
    addMaterial({
      titulo: form.titulo.endsWith('.pdf') ? form.titulo : `${form.titulo}.pdf`,
      curso: form.curso,
      categoria: form.categoria,
      tamano: form.tamano || '1.0 MB',
    });
    setForm({ curso: 'Piano Básico', titulo: '', categoria: 'Partitura', tamano: '' });
    setArchivoNombre('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <Toast message={toast} />

      <h1 className="text-2xl font-bold text-gray-900">Material Bibliográfico</h1>
      <p className="mt-1 text-sm text-gray-500">Recursos disponibles para tus estudiantes</p>

      <form className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-card" onSubmit={subir}>
        <h2 className="font-bold text-amc-oscuro">Subir Nuevo Material</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Curso destino</label>
            <select value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Piano Básico</option>
              <option>Piano Avanzado</option>
              <option>Violín Intermedio</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Título del material</label>
            <input
              placeholder="Nombre del archivo"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Categoría</label>
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Partitura</option>
              <option>Teoría</option>
              <option>Ejercicio</option>
            </select>
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onArchivo} />
        <div className="mt-4 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8">
          <span className="text-3xl">📁</span>
          {archivoNombre && <p className="mt-2 text-sm text-gray-600">{archivoNombre}</p>}
          <button type="button" onClick={seleccionarArchivo} className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
            Seleccionar Archivo
          </button>
        </div>
        <button type="submit" className="mt-4 rounded-lg bg-amc-oscuro px-5 py-2.5 text-sm font-semibold text-white hover:bg-amc-verde">
          Subir material
        </button>
      </form>

      <h2 className="mt-8 text-lg font-bold text-gray-900">Materiales Disponibles</h2>
      <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-card">
        {materiales.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-gray-500">No hay materiales subidos</li>
        ) : (
          materiales.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📕</span>
                <div>
                  <p className="font-medium text-gray-800">{m.titulo}</p>
                  <p className="text-xs text-gray-500">{m.categoria} · {m.curso} · {m.tamano} · Subido {m.fecha}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => downloadMaterial(m)} className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50">
                  Descargar
                </button>
                <button type="button" onClick={() => deleteMaterial(m.id)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100">
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
