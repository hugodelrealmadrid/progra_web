import { Link } from 'react-router-dom';

export default function Registro() {
  return (
    <section className="bg-amc-palido px-4 py-16 md:px-8">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-amc-oscuro">Registrarse</h1>
        <p className="mt-2 text-sm text-gray-600">Crea tu cuenta en la academia (wireframe).</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Nombre completo</label>
            <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Email</label>
            <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Contraseña</label>
            <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-amc-verde py-2.5 text-sm font-bold text-white hover:bg-amc-oscuro"
          >
            Registrarse
          </button>
        </form>
        <Link to="/login" className="mt-4 block text-center text-sm text-amc-acento hover:underline">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </section>
  );
}
