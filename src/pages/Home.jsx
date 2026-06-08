import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="bg-amc-palido px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="text-3xl font-bold text-amc-oscuro md:text-4xl">
          Conoce la Convocatoria 2026
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 md:text-base">
          Layout base AMC — Tailwind, Navbar y Footer configurados por Emily Condori.
        </p>
        <Link
          to="/ofertas"
          className="mt-8 inline-block rounded-lg bg-amc-verde px-6 py-3 text-sm font-semibold text-white transition hover:bg-amc-oscuro"
        >
          Ver oferta académica
        </Link>
      </div>
    </section>
  );
}
