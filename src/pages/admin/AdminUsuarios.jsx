import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IMG } from '../../data/images';

const ROL_COLOR = {
  admin:      'text-amc-acento',
  profesor:   'text-purple-600',
  estudiante: 'text-blue-600',
};

export default function AdminUsuarios() {
  const { usuarios = [], addUser, updateUser, rolLabelOf } = useAuth();
  const [buscar, setBuscar]       = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState({ nombre: '', email: '', password: 'demo1234', rol: 'estudiante' });
  const [msg, setMsg]             = useState('');

  const filtrados = useMemo(() => {
    return (usuarios ?? []).filter((u) => {
      const matchBuscar =
        (u.nombre ?? '').toLowerCase().includes(buscar.toLowerCase()) ||
        (u.email  ?? '').toLowerCase().includes(buscar.toLowerCase());
      const matchRol = filtroRol === 'todos' || u.rol === filtroRol;
      return matchBuscar && matchRol;
    });
  }, [usuarios, buscar, filtroRol]);

  const handleNuevo = async () => {
    if (!form.nombre || !form.email) { setMsg('Nombre y email son obligatorios.'); return; }
    const result = await addUser({ ...form, avatar: IMG.ninos });
    if (result && !result.ok) { setMsg(result.error ?? 'Error al crear usuario'); return; }
    setMsg('Usuario creado correctamente');
    setForm({ nombre: '', email: '', password: 'demo1234', rol: 'estudiante' });
  };

  const handleGuardarRol = async (uid, rol) => {
    await updateUser(uid, { rol });
    setEditId(null);
    setMsg('Rol actualizado');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios y roles</h1>
      </div>

      {msg && <p className="mt-3 text-sm text-green-600">{msg}</p>}

      {/* Formulario nuevo usuario */}
      <div className="mt-5 grid gap-3 rounded-lg border border-gray-200 bg-amc-palido/30 p-4 md:grid-cols-4">
        <input placeholder="Nombre"       value={form.nombre}   onChange={(e) => setForm({ ...form, nombre:   e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Email"        value={form.email}    onChange={(e) => setForm({ ...form, email:    e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Contraseña"   value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="button" onClick={handleNuevo} className="rounded-lg bg-amc-oscuro px-3 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
            + Agregar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar por nombre o email..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm md:w-64"
        />
        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="todos">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="profesor">Profesor</option>
          <option value="estudiante">Estudiante</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No hay usuarios que coincidan.</td></tr>
            )}
            {filtrados.map((u) => {
              const uid = u.uid ?? u.id;
              return (
                <tr key={uid ?? u.email} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar ?? IMG.ninos} alt="" className="h-9 w-9 rounded-full object-cover" />
                      <span className="font-medium">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    {editId === uid ? (
                      <select
                        defaultValue={u.rol}
                        onChange={(e) => handleGuardarRol(uid, e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="admin">Administrador</option>
                        <option value="profesor">Profesor</option>
                        <option value="estudiante">Estudiante</option>
                      </select>
                    ) : (
                      <span className={`font-medium ${ROL_COLOR[u.rol] ?? 'text-gray-600'}`}>
                        {rolLabelOf?.(u.rol) ?? u.rol}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${u.activo !== false ? 'text-green-600' : 'text-red-500'}`}>
                      {u.activo !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditId(editId === uid ? null : uid)}
                      className="rounded border border-amc-claro bg-amc-palido px-3 py-1 text-xs font-medium text-amc-oscuro hover:bg-amc-claro"
                    >
                      {editId === uid ? 'Cancelar' : 'Editar rol'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
