import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMG } from '../data/images';

export default function Login() {
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('emily@admin.amc.bo');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginWithCredentials(email.trim(), password);
    if (!result.ok) setError(result.error);
    else setError('');
  };

  return (
    <section
      className="relative flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-800 bg-cover bg-center px-6 py-16"
      style={{ backgroundImage: `url('${IMG.edificio}')` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-8 shadow-card md:p-10">
        <h1 className="text-center text-xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Accede a tu panel de la academia</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-amc-oscuro py-3 text-sm font-bold text-white hover:bg-amc-verde"
          >
            Iniciar sesión
          </button>
        </form>

        <Link to="/registro" className="mt-6 block text-center text-sm text-amc-acento hover:underline">
          ¿No tienes cuenta? Regístrate
        </Link>
      </div>
    </section>
  );
}
