import SectionTitle from '../components/SectionTitle';
import { IMG } from '../data/images';
import { useContenido } from '../context/ContenidoContext';

function SeccionHistoria({ seccion }) {
  const fondo = seccion.fondo === 'palido' ? 'bg-amc-palido' : 'bg-white';

  if (seccion.layout === 'image-right') {
    return (
      <section className={`${fondo} px-6 py-12 md:px-10`}>
        <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-2 md:items-start">
          <div>
            <SectionTitle>{seccion.titulo}</SectionTitle>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 md:text-base">
              {(seccion.parrafos || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          {seccion.imagen && (
            <img
              src={seccion.imagen}
              alt={seccion.titulo}
              className="w-full rounded-lg object-cover shadow-card md:max-h-80"
              loading="lazy"
            />
          )}
        </div>
      </section>
    );
  }

  if (seccion.layout === 'gallery') {
    return (
      <section className={`${fondo} px-6 py-12 md:px-10`}>
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle>{seccion.titulo}</SectionTitle>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {(seccion.imagenes || []).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${seccion.titulo} ${i + 1}`}
                className="h-64 w-full rounded-lg object-cover shadow-card md:h-72"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${fondo} px-6 py-12 md:px-10`}>
      <div className="mx-auto max-w-[1440px]">
        <SectionTitle>{seccion.titulo}</SectionTitle>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 md:text-base">
          {(seccion.parrafos || []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Historia() {
  const { historia, loading } = useContenido();

  if (loading) {
    return (
      <div className="bg-amc-palido px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[1440px] animate-pulse space-y-6">
          <div className="h-12 w-2/3 rounded bg-white/80" />
          <div className="h-6 w-full max-w-xl rounded bg-white/80" />
          <div className="h-64 rounded-lg bg-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amc-palido">
      <section className="historia-hero px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1440px]">
          <h1 className="hero-title text-4xl font-bold text-gray-900 md:text-5xl">{historia.titulo}</h1>
          <p className="hero-subtitle mt-4 max-w-3xl text-base text-gray-700">{historia.intro}</p>
          <div className="hero-image-main mt-8 overflow-hidden rounded-lg shadow-card">
            <img
              src={historia.imagenHero || IMG.edificio}
              alt="Edificio Academia AMC"
              className="h-64 w-full object-cover md:h-96"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {(historia.secciones || []).map((seccion) => (
        <SeccionHistoria key={seccion.id || seccion.titulo} seccion={seccion} />
      ))}
    </div>
  );
}
