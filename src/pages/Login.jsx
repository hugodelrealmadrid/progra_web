import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_USERS = [
  { nombre: 'Emily Condori', email: 'emily@admin.amc.bo', rol: 'admin' },
  { nombre: 'Hugo Delgado', email: 'hugo@profesor.amc.bo', rol: 'profesor' },
  { nombre: 'Flores Viza', email: 'flores@estudiante.amc.bo', rol: 'estudiante' },
];

export default function Login() {
  const { login } = useAuth();

  return (
    <section className="bg-amc-palido px-4 py-16 md:px-8">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-amc-oscuro">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-gray-600">
          Accede a tu panel de la academia. (Demo hasta conectar Firebase Auth)
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(DEMO_USERS[0]);
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              defaultValue="emily@admin.amc.bo"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Contraseña</label>
            <input
              type="password"
              defaultValue="demo1234"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-amc-verde py-2.5 text-sm font-bold text-white hover:bg-amc-oscuro"
          >
            INGRESAR
          </button>
        </form>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Acceso rápido demo por rol
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {DEMO_USERS.map((u) => (
            <button
              key={u.rol}
              type="button"
              onClick={() => login(u)}
              className="rounded-lg border border-amc-verde px-3 py-2 text-left text-sm text-amc-oscuro hover:bg-amc-palido"
            >
              {u.nombre} — <span className="font-semibold capitalize">{u.rol}</span>
            </button>
          ))}
        </div>

        <Link to="/registro" className="mt-4 block text-center text-sm text-amc-acento hover:underline">
          ¿No tienes cuenta? Regístrate
        </Link>
      </div>
    </section>
  );
}
