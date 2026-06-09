import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMG } from '../data/images';

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('estudiante');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register({ nombre: nombre.trim(), email: email.trim(), password, rol });
    if (!result.ok) {
      setError(result.error);
      setOk('');
      return;
    }
    setError('');
    setOk('Cuenta creada. Redirigiendo al login...');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <section
      className="relative flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-800 bg-cover bg-center px-6 py-16"
      style={{ backgroundImage: `url('${IMG.edificio}')` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-8 shadow-card md:p-10">
        <h1 className="text-center text-xl font-bold text-gray-900">Registrarse</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Crea tu cuenta en la academia</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
            </select>
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          {ok && <p className="text-center text-sm text-green-600">{ok}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-amc-oscuro py-3 text-sm font-bold text-white hover:bg-amc-verde"
          >
            Registrarse
          </button>
        </form>

        <Link to="/login" className="mt-6 block text-center text-sm text-amc-acento hover:underline">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </section>
  );
}
