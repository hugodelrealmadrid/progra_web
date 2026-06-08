import { useAuth } from '../context/AuthContext';

const ROLE_LABEL = {
  admin: 'Administrador',
  profesor: 'Profesor',
  estudiante: 'Estudiante',
};

export default function PanelPage({ rol }) {
  const { user } = useAuth();

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-amc-oscuro">Panel {ROLE_LABEL[rol]}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}. Layout base AMC funcionando.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Resumen', 'Acciones', 'Avisos'].map((card) => (
            <div key={card} className="rounded-lg border border-amc-claro bg-white p-6 shadow-card">
              <h2 className="font-semibold text-amc-acento">{card}</h2>
              <p className="mt-2 text-sm text-gray-600">Contenido del panel — en desarrollo por el equipo.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
