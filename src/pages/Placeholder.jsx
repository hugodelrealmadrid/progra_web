export default function Placeholder({ title }) {
  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-amc-oscuro">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">Página en construcción — equipo AMC.</p>
      </div>
    </section>
  );
}
