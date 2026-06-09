import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import { IMG } from '../data/images';

const niveles = [
  {
    title: 'Nivel infantil (3 - 6 años)',
    desc: 'Enfocado a los más pequeños, este nivel busca introducir a los niños a la música mediante juegos, ritmos y canciones, en un horario poco cargado durante las tardes.',
    img: IMG.ninos,
    imgRight: true,
    buttons: ['Mirar Horario'],
  },
  {
    title: 'Nivel básico (7-11) e Intensivo (15 - XX)',
    desc: 'Enfocado a los jóvenes y personas de toda edad que desean comenzar su travesía a través del mundo de la música, en un horario por la tarde para nivel Básico y un horario tarde-noche para Intensivo.',
    img: IMG.coro,
    imgRight: false,
    buttons: ['Mirar Horario', 'Mirar Materias'],
  },
  {
    title: 'Nivel Medio (Toda edad)',
    desc: 'Enfocado a las personas que avanzaron de los niveles anteriores a este para seguir su formación artística, con un horario completo de 30hrs semanales y con instrumentos secundarios a la especialidad principal.',
    img: IMG.orquesta,
    imgRight: true,
    buttons: ['Mirar Horarios', 'Mirar Materias'],
  },
  {
    title: 'Nivel Superior (+18)',
    desc: 'Estudio superior casi a nivel de Licenciatura. Enfocado para los estudiantes bachilleres y a los estudiantes egresados de la academia que deseen encaminar su vida a la Música.',
    img: IMG.piano,
    imgRight: false,
    buttons: ['Mirar Horarios', 'Mirar Materias'],
  },
];

const especialidadesSec = [
  { title: 'Canto Lírico', desc: 'Una especialidad dedicada a todos aquellos quienes estén interesados en el canto al estilo Lírico o de Ópera. Contamos con los mejores recursos para potenciar la voz.' },
  { title: 'Instrumentos de Vientos Bronce', desc: 'Incluye instrumentos como Trompeta, Corno Francés, Tuba, Euphonium, Trombón y otros. Contamos con todo el material necesario; si no tiene alguno, la academia puede prestárselo.' },
  { title: 'Instrumentos de Vientos Madera', desc: 'Incluye instrumentos como Clarinete, Flauta Travesera, Saxofón y demás. Contamos con todo el material necesario para aprender estos instrumentos de orquesta.' },
  { title: 'Instrumentos de Cuerdas', desc: 'Contamos con especialidad en instrumentos de cuerdas poco comunes, como la Viola y el Contrabajo, dando la opción a todos los estudiantes de aprender estos instrumentos.' },
];

export default function Ofertas() {
  return (
    <div className="bg-amc-palido">
      <section className="relative h-56 overflow-hidden md:h-72">
        <img src={IMG.edificio} alt="Oferta académica AMC" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Oferta Academica y cursos</h1>
        </div>
      </section>

      <section className="bg-amc-palido px-6 py-10 text-center md:px-10">
        <p className="font-serif text-2xl italic text-gray-800 md:text-3xl">&ldquo;Formando Músicos desde 1940&rdquo;</p>
      </section>

      <section className="space-y-16 bg-amc-palido px-6 py-8 md:px-10">
        <div className="mx-auto max-w-[1440px] space-y-16">
          {niveles.map((n) => (
            <div key={n.title} className="grid items-center gap-8 md:grid-cols-2">
              {!n.imgRight && (
                <img src={n.img} alt={n.title} className="h-64 w-full rounded-lg object-cover shadow-card md:h-80" loading="lazy" />
              )}
              <div>
                <h2 className="text-xl font-bold text-amc-oscuro md:text-2xl">{n.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">{n.desc}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {n.buttons.map((btn, i) => (
                    <Link
                      key={btn}
                      to="/contacto"
                      className={
                        i === 0
                          ? 'rounded-lg bg-amc-verde px-5 py-2.5 text-sm font-semibold text-white hover:bg-amc-oscuro'
                          : 'rounded-lg border border-gray-300 bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-200'
                      }
                    >
                      {btn}
                    </Link>
                  ))}
                </div>
              </div>
              {n.imgRight && (
                <img src={n.img} alt={n.title} className="h-64 w-full rounded-lg object-cover shadow-card md:h-80" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle>Especialidades Secundarias</SectionTitle>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {especialidadesSec.map((esp) => (
              <div key={esp.title}>
                <h3 className="text-lg font-bold text-amc-oscuro">{esp.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{esp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
