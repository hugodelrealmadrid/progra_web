import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IMG } from '../../data/images';

function RolBadge({ rol, rolLabelOf }) {
  const label = rolLabelOf(rol);
  const isAdmin = rol === 'admin';
  return (
    <span className={`font-medium ${isAdmin ? 'text-amc-acento' : 'text-purple-600'}`}>
      {label}
    </span>
  );
}

export default function AdminUsuarios() {
  const { users, addUser, updateUser, rolLabelOf } = useAuth();
  const [buscar, setBuscar] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [editEmail, setEditEmail] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '', password: 'demo1234', rol: 'estudiante' });
  const [msg, setMsg] = useState('');

  const filtrados = useMemo(() => {
    return users.filter((u) => {
      const matchBuscar =
        u.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        u.email.toLowerCase().includes(buscar.toLowerCase());
      const matchRol = filtroRol === 'todos' || u.rol === filtroRol;
      return matchBuscar && matchRol;
    });
  }, [users, buscar, filtroRol]);

  const handleNuevo = () => {
    const result = addUser({ ...form, avatar: IMG.ninos });
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    setMsg('Usuario creado');
    setForm({ nombre: '', email: '', password: 'demo1234', rol: 'estudiante' });
  };

  const handleGuardarRol = (email, rol) => {
    updateUser(email, { rol });
    setEditEmail(null);
    setMsg('Rol actualizado');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios y roles</h1>
        <button type="button" onClick={handleNuevo} className="rounded-lg bg-amc-oscuro px-4 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
          + Nuevo usuario
        </button>
      </div>

      {msg && <p className="mt-3 text-sm text-green-600">{msg}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar..."
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

      <div className="mt-4 grid gap-3 rounded-lg border border-gray-200 bg-amc-palido/30 p-4 md:grid-cols-4">
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[800px] text-left text-sm">
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
            {filtrados.map((u) => (
              <tr key={u.email} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <span className="font-medium">{u.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  {editEmail === u.email ? (
                    <select
                      defaultValue={u.rol}
                      onChange={(e) => handleGuardarRol(u.email, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      <option value="admin">Administrador</option>
                      <option value="profesor">Profesor</option>
                      <option value="estudiante">Estudiante</option>
                    </select>
                  ) : (
                    <RolBadge rol={u.rol} rolLabelOf={rolLabelOf} />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-green-600">Activo</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setEditEmail(editEmail === u.email ? null : u.email)}
                    className="rounded border border-amc-claro bg-amc-palido px-3 py-1 text-xs font-medium text-amc-oscuro hover:bg-amc-claro"
                  >
                    {u.rol === 'admin' ? 'Editar rol' : 'Editar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
