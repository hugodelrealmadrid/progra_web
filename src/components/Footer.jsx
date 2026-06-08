import { Link } from 'react-router-dom';

const footerColumns = [
  {
    title: 'Recursos',
    links: [
      { label: 'Explorar', to: '/' },
      { label: 'Contacto Principal', to: '/contacto' },
    ],
  },
  {
    title: 'Academia',
    links: [
      { label: 'Especialidades Secundarias', to: '/ofertas' },
      { label: 'Metodos de Ensenanza', to: '/ofertas' },
      { label: 'Clases Colectivas', to: '/ofertas' },
    ],
  },
  {
    title: 'Visitanos en:',
    links: [
      { label: 'Biblioteca digital', to: '/ofertas' },
      { label: 'Inscripciones', to: '/ofertas' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#2a2a2a] text-gray-300">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-10 md:grid-cols-4 md:px-8">
        <div>
          <p className="text-2xl font-bold text-white">amc</p>
          <p className="mt-2 text-sm text-gray-400">
            Academia Nacional de Musica &quot;Man Cesped&quot;
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Formación musical de excelencia en Bolivia.
          </p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Academia de Música Man Césped. Todos los derechos reservados.
      </div>
    </footer>
  );
}
