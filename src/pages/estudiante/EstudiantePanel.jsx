import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAcademico } from '../../context/AcademicoContext';
import PanelSectionTitle from '../../components/PanelSectionTitle';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import { IMG } from '../../data/images';

const MALLA_COLORS = {
  aprobada: 'bg-green-100 text-green-800 border-green-300',
  cursando: 'bg-amber-100 text-amber-800 border-amber-300',
  disponible: 'bg-amc-palido text-amc-oscuro border-amc-claro',
  bloqueada: 'bg-red-50 text-red-400 border-red-200',
};

export default function EstudiantePanel() {
  const { user, updateUser } = useAuth();
  const {
    cursosEstudiante,
    materiales,
    malla,
    toast,
    getPerfilEstudiante,
    getCalificacionesEstudiante,
    updatePerfilEstudiante,
    downloadMaterial,
    showToast,
  } = useAcademico();

  const email = user?.email ?? '';
  const perfilBase = getPerfilEstudiante(email, user);
  const [editOpen, setEditOpen] = useState(false);
  const [cursoDetalle, setCursoDetalle] = useState(null);
  const [form, setForm] = useState({
    nombre: user?.nombre ?? '',
    especialidad: perfilBase.especialidad,
    telefono: perfilBase.telefono ?? '',
    fechaIngreso: perfilBase.fechaIngreso,
    avatar: perfilBase.avatar,
  });

  const calificaciones = getCalificacionesEstudiante(user?.nombre ?? '');

  const guardarPerfil = (e) => {
    e.preventDefault();
    updatePerfilEstudiante(email, {
      especialidad: form.especialidad,
      telefono: form.telefono,
      fechaIngreso: form.fechaIngreso,
      avatar: form.avatar,
    });
    updateUser(email, { nombre: form.nombre, avatar: form.avatar });
    setEditOpen(false);
  };

  const cambiarFoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, avatar: URL.createObjectURL(file) }));
  };

  const promedioGeneral = () => {
    const nums = calificaciones.flatMap((c) => [c.b1, c.b2, c.b3, c.b4].filter((v) => v !== '—' && v != null));
    if (!nums.length) return '—';
    return Math.round(nums.reduce((s, v) => s + Number(v), 0) / nums.length);
  };

  return (
    <>
      <Toast message={toast} />

      <div
        className="relative flex h-48 items-center justify-center bg-cover bg-center md:h-56"
        style={{ backgroundImage: `url('${IMG.piano}')` }}
      >
        <div className="absolute inset-0 bg-amc-oscuro/70" />
        <h1 className="relative z-10 text-2xl font-bold text-white md:text-3xl">
          Panel Personal del Estudiante
        </h1>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 md:px-8">
        {/* Tarjetas resumen */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-amc-acento">{cursosEstudiante.length}</p>
            <p className="text-sm text-gray-600">Cursos inscritos</p>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-amc-acento">{materiales.length}</p>
            <p className="text-sm text-gray-600">Materiales disponibles</p>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-amc-acento">{promedioGeneral()}</p>
            <p className="text-sm text-gray-600">Promedio general</p>
          </div>
        </div>

        <div className="-mt-2 rounded-lg bg-white p-6 shadow-card md:p-8">
          <PanelSectionTitle>Mi Perfil</PanelSectionTitle>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            <img
              src={perfilBase.avatar}
              alt={user?.nombre}
              className="h-36 w-36 shrink-0 rounded-lg border-4 border-amc-oscuro object-cover md:h-44 md:w-44"
            />
            <div className="flex-1 space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold text-amc-oscuro">Nombre:</span> {user?.nombre}</p>
              <p><span className="font-semibold text-amc-oscuro">Correo:</span> {email}</p>
              <p><span className="font-semibold text-amc-oscuro">Especialidad:</span> {perfilBase.especialidad}</p>
              <p><span className="font-semibold text-amc-oscuro">Teléfono:</span> {perfilBase.telefono || 'No registrado'}</p>
              <p><span className="font-semibold text-amc-oscuro">Fecha de Ingreso:</span> {perfilBase.fechaIngreso}</p>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    nombre: user?.nombre ?? '',
                    especialidad: perfilBase.especialidad,
                    telefono: perfilBase.telefono ?? '',
                    fechaIngreso: perfilBase.fechaIngreso,
                    avatar: perfilBase.avatar,
                  });
                  setEditOpen(true);
                }}
                className="mt-4 rounded-lg bg-amc-oscuro px-5 py-2 text-sm font-semibold text-white hover:bg-amc-verde"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <PanelSectionTitle>Cursos Inscritos</PanelSectionTitle>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {cursosEstudiante.map((c) => (
              <article key={c.nombre} className="overflow-hidden rounded-lg bg-white shadow-card">
                <img src={c.img} alt={c.nombre} className="h-28 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-amc-oscuro">{c.nombre}</h3>
                  <p className="mt-1 text-sm text-gray-600">Profesor: {c.profesor}</p>
                  <p className="text-sm text-gray-600">Horario: {c.horario}</p>
                  <button
                    type="button"
                    onClick={() => setCursoDetalle(c)}
                    className="mt-3 text-xs font-semibold text-amc-acento hover:underline"
                  >
                    Ver detalle →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <PanelSectionTitle>Calificaciones Gestión 2026</PanelSectionTitle>
          <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="bg-amc-oscuro text-white">
                  <th className="px-4 py-3">Materia / Curso</th>
                  <th className="px-4 py-3">1er Bimestre</th>
                  <th className="px-4 py-3">2do Bimestre</th>
                  <th className="px-4 py-3">3er Bimestre</th>
                  <th className="px-4 py-3">4to Bimestre</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((row, i) => (
                  <tr key={row.materia} className={i % 2 === 0 ? 'bg-amc-palido/60' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium">{row.materia}</td>
                    <td className="px-4 py-3">{row.b1}</td>
                    <td className="px-4 py-3">{row.b2}</td>
                    <td className="px-4 py-3">{row.b3}</td>
                    <td className="px-4 py-3">{row.b4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <PanelSectionTitle>Material Bibliográfico</PanelSectionTitle>
          <ul className="mt-5 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {materiales.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-500">No hay materiales disponibles aún</li>
            ) : (
              materiales.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.titulo}</p>
                      <p className="text-xs text-gray-500">{m.curso} · {m.categoria}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadMaterial(m)}
                    className="rounded border border-amc-verde px-3 py-1 text-xs font-semibold text-amc-verde hover:bg-amc-palido"
                  >
                    Descargar
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="mt-10">
          <PanelSectionTitle>Horario Semanal</PanelSectionTitle>
          <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="bg-amc-oscuro text-white">
                  <th className="px-3 py-3">Hora</th>
                  <th className="px-3 py-3">Lunes</th>
                  <th className="px-3 py-3">Martes</th>
                  <th className="px-3 py-3">Miércoles</th>
                  <th className="px-3 py-3">Jueves</th>
                  <th className="px-3 py-3">Viernes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { hora: '08:00 - 09:30', lun: 'Piano', mar: '', mie: 'Piano', jue: 'Teoría', vie: '' },
                  { hora: '10:00 - 11:30', lun: '', mar: 'Teoría', mie: '', jue: '', vie: 'Orquesta' },
                  { hora: '14:00 - 15:30', lun: '', mar: 'Lectura', mie: '', jue: 'Lectura', vie: '' },
                ].map((fila) => (
                  <tr key={fila.hora} className="border-t border-gray-100 even:bg-amc-palido/40">
                    <td className="px-3 py-3 font-medium text-gray-600">{fila.hora}</td>
                    <td className="px-3 py-3">{fila.lun}</td>
                    <td className="px-3 py-3">{fila.mar}</td>
                    <td className="px-3 py-3">{fila.mie}</td>
                    <td className="px-3 py-3">{fila.jue}</td>
                    <td className="px-3 py-3">{fila.vie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <PanelSectionTitle>Malla Curricular</PanelSectionTitle>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-green-300 bg-green-100 px-3 py-1 text-green-800">✓ Aprobadas</span>
            <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-amber-800">✎ Cursando / Disponible</span>
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-400">🔒 Bloqueadas</span>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[500px] text-center text-sm">
              <thead>
                <tr className="bg-amc-oscuro text-white">
                  {malla.niveles.map((n) => (
                    <th key={n} className="px-3 py-3">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {malla.materias.map((fila, fi) => (
                  <tr key={fi} className="border-t border-gray-100">
                    {fila.map((mat, ci) => (
                      <td key={ci} className="p-2">
                        <span className={`inline-block rounded border px-2 py-1.5 text-xs ${MALLA_COLORS[malla.estados[fi][ci]]}`}>
                          {mat}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar Perfil">
        <form className="space-y-4" onSubmit={guardarPerfil}>
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Especialidad</label>
            <input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Teléfono</label>
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Foto de perfil</label>
            <input type="file" accept="image/*" onChange={cambiarFoto} className="w-full text-sm" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-amc-oscuro py-2.5 text-sm font-semibold text-white hover:bg-amc-verde">
            Guardar cambios
          </button>
        </form>
      </Modal>

      <Modal open={!!cursoDetalle} onClose={() => setCursoDetalle(null)} title={cursoDetalle?.nombre ?? 'Curso'}>
        {cursoDetalle && (
          <div className="space-y-3 text-sm">
            <img src={cursoDetalle.img} alt="" className="h-40 w-full rounded-lg object-cover" />
            <p><strong>Profesor:</strong> {cursoDetalle.profesor}</p>
            <p><strong>Horario:</strong> {cursoDetalle.horario}</p>
            <p className="text-gray-600">Asistencia registrada. Consulta tus calificaciones en la sección correspondiente.</p>
            <button type="button" onClick={() => { setCursoDetalle(null); showToast('Información del curso consultada'); }} className="rounded-lg bg-amc-palido px-4 py-2 text-sm font-medium text-amc-oscuro">
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
