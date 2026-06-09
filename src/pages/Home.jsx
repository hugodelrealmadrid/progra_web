import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import { IMG } from '../data/images';
import { useContenido } from '../context/ContenidoContext';

const orquestasDetalle = [
  {
    nombre: 'Orquesta Sinfónica Juvenil AMC',
    desc: 'Integrada por estudiantes de nivel medio y superior. Representa a la academia en eventos culturales nacionales.',
  },
  {
    nombre: 'Orquesta de Guitarras',
    desc: 'Conjunto especializado en repertorio clásico y latinoamericano, con participación de docentes y alumnos destacados.',
  },
  {
    nombre: 'Banda Sinfónica Institucional',
    desc: 'Conformada por vientos, percusión y cuerdas. Participa en ceremonias oficiales y conciertos al aire libre.',
  },
  {
    nombre: 'Conjuntos de Cámara',
    desc: 'Grupos de cámara y ensambles por especialidad, preparados para recitales y muestras académicas.',
  },
];

const niveles = [
  {
    title: 'Violín Clásico',
    desc: 'Programa de formación musical para jóvenes con enfoque técnico y artístico.',
    img: IMG.violin,
  },
  {
    title: 'Técnico Superior',
    desc: 'Nivel avanzado con especialización instrumental y preparación profesional.',
    img: IMG.piano,
  },
];

export default function Home() {
  const { general, cursos, loading } = useContenido();

  const cursosDestacados = cursos.length
    ? cursos
    : [
        { id: '1', nombre: 'Piano Forte', descripcion: 'La especialidad más solicitada.', img: IMG.piano },
        { id: '2', nombre: 'Guitarra Clásica', descripcion: 'Aprende guitarra clásica.', img: IMG.guitarra },
        { id: '3', nombre: 'Violín Clásico', descripcion: 'Entra al mundo del violín.', img: IMG.violin },
      ];

  return (
    <>
      <section className="hero-section overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-12 md:grid-cols-2 md:items-start md:px-10 md:py-16">
          <div className="hero-text">
            <h1 className="hero-title text-4xl font-bold leading-tight text-amc-oscuro md:text-5xl">
              {general.titulo}
            </h1>
            <p className="hero-subtitle mt-5 text-base leading-relaxed text-gray-600">
              {general.subtitulo}
            </p>
            <Link
              to={general.botonLink || '/ofertas'}
              className="hero-cta mt-8 inline-block rounded-lg bg-amc-acento px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#238c42]"
            >
              {general.boton}
            </Link>
            <div className="hero-image-secondary mt-6 overflow-hidden rounded-lg shadow-card">
              <img
                src={general.imagenSecundaria || IMG.piano}
                alt="Instrumento - Academia AMC"
                className="h-48 w-full object-cover md:h-56"
              />
            </div>
          </div>
          <div className="hero-image-main overflow-hidden rounded-lg shadow-card">
            <img
              src={general.imagen || IMG.edificio}
              alt="Edificio Academia AMC"
              className="h-64 w-full object-cover md:h-80"
            />
          </div>
        </div>
      </section>

      <section className="bg-amc-palido px-6 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle className="text-center">Cursos destacados</SectionTitle>
          {loading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 animate-pulse rounded-lg bg-white/80" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {cursosDestacados.map((item, i) => (
                <article
                  key={item.id || item.codigo || item.nombre}
                  className="course-card overflow-hidden rounded-lg bg-white shadow-card"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <img
                    src={item.img || IMG.piano}
                    alt={item.nombre}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-amc-oscuro">{item.nombre}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {item.descripcion || `${item.nivel || ''} · ${item.profesor || ''}`.trim()}
                    </p>
                    {item.cuposTotal != null && (
                      <p className="mt-2 text-xs font-medium text-amc-verde">
                        Cupos: {item.cuposOcupados ?? 0}/{item.cuposTotal}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-6 py-14 md:px-10">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-2 md:items-start">
          <div>
            <SectionTitle>Orquestas y Conjuntos</SectionTitle>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              La Academia Nacional de Música &quot;Man Césped&quot; cuenta con agrupaciones
              musicales de carácter formativo y representativo. Estas orquestas están conformadas
              por estudiantes de distintos niveles, bajo la dirección de docentes especializados,
              y participan en la vida cultural del país como embajadoras del talento joven boliviano.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Las orquestas institucionales de la AMC han participado en festivales nacionales,
              intercambios culturales y conciertos oficiales. Su trabajo fortalece la identidad
              musical de Bolivia y proyecta a la academia como referente en formación orquestal.
            </p>
            <div className="mt-6 space-y-4">
              {orquestasDetalle.map((o) => (
                <div key={o.nombre} className="rounded-lg border border-amc-claro bg-amc-palido p-4">
                  <h3 className="font-bold text-amc-oscuro">{o.nombre}</h3>
                  <p className="mt-1 text-sm text-gray-600">{o.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/historia" className="rounded-lg border border-amc-verde px-5 py-2 text-sm font-semibold text-amc-verde hover:bg-amc-palido">
                Conoce más
              </Link>
              <Link to="/ofertas" className="rounded-lg bg-amc-verde px-5 py-2 text-sm font-semibold text-white hover:bg-amc-oscuro">
                Inscríbete ahora
              </Link>
            </div>
          </div>
          <img
            src={IMG.orquesta}
            alt="Orquesta AMC"
            className="h-80 w-full rounded-lg object-cover shadow-card md:h-[520px]"
            loading="lazy"
          />
        </div>
      </section>

      <section className="bg-amc-palido px-6 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle className="text-center">Niveles de Enseñanza</SectionTitle>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {niveles.map((n) => (
              <article key={n.title} className="overflow-hidden rounded-lg bg-white shadow-card md:flex">
                <img src={n.img} alt={n.title} className="h-48 w-full object-cover md:h-auto md:w-2/5" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amc-oscuro">{n.title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{n.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle>Ubicación</SectionTitle>
          <p className="mt-3 text-sm text-gray-600">Visítanos en nuestras instalaciones en La Paz, Bolivia.</p>
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-card">
            <img src={IMG.mapa} alt="Mapa ubicación AMC" className="h-56 w-full object-cover md:h-72" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="cta-section bg-amc-claro px-6 py-16 text-center md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="cta-title text-3xl font-bold text-amc-oscuro">{general.ctaTitulo}</h2>
          <p className="cta-subtitle mt-3 text-gray-600">{general.ctaSubtitulo}</p>
          <div className="cta-buttons mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={general.ctaBoton1Link || '/ofertas'}
              className="rounded-lg bg-amc-verde px-8 py-3 text-sm font-bold text-white hover:bg-amc-oscuro"
            >
              {general.ctaBoton1}
            </Link>
            <Link
              to={general.ctaBoton2Link || '/contacto'}
              className="rounded-lg border border-amc-verde bg-white px-8 py-3 text-sm font-bold text-amc-verde hover:bg-amc-palido"
            >
              {general.ctaBoton2}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
