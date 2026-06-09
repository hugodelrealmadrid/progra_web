import { IMG } from './images';

export const DEFAULT_GENERAL = {
  titulo: 'Conoce la Convocatoria 2026',
  subtitulo:
    'La Academia Nacional de Música "Man Césped" abre sus puertas a nuevos estudiantes. Formación musical integral con docentes de excelencia y orquestas institucionales.',
  boton: 'Ir a la convocatoria',
  botonLink: '/ofertas',
  imagen: IMG.edificio,
  imagenSecundaria: IMG.piano,
  ctaTitulo: '¡Postúlate ahora!',
  ctaSubtitulo: 'Forma parte de la familia musical de la AMC.',
  ctaBoton1: 'Inscribirse',
  ctaBoton1Link: '/ofertas',
  ctaBoton2: 'Contactarse',
  ctaBoton2Link: '/contacto',
};

export const DEFAULT_HISTORIA = {
  titulo: 'Historia y Recorrido',
  intro:
    'A continuación se da a conocer la historia y camino de la Academia y su evolución en el paso del tiempo.',
  imagenHero: IMG.edificio,
  secciones: [
    {
      id: 'fundacion',
      titulo: 'Fundación e Inicios',
      layout: 'text',
      fondo: 'white',
      parrafos: [
        'La academia fue fundada en 1940 como "Academia de Bellas Artes \'Man Césped\'". Entre sus fundadores se encuentran Humberto Viscarra Monje y Eduardo Laredo. Su misión fue forjar y promover los nuevos valores en el cultivo de las Bellas Artes, iniciando sus actividades en el hogar de Concepción Ocampo de Quiroga.',
        'En 1947, la sección de Artes Plásticas se separó para formar la "Escuela de Artes Plásticas \'Raúl G. Prada\'". Entre sus egresados destacados figuran Jaime Laredo (violinista) y Wálter Ponce (pianista).',
      ],
    },
    {
      id: 'crisis',
      titulo: 'Crisis y Reestructuración',
      layout: 'image-right',
      fondo: 'palido',
      imagen: IMG.director,
      parrafos: [
        'Durante las décadas de 1960 la institución atravesó dificultades. En 1989 recibió reconocimientos nacionales por su labor cultural. En 1998 inició un proceso de reestructuración bajo la dirección de Koichi Fujii.',
        'La reestructuración incorporó nueva filosofía educativa, instrumentos y plan de estudios. La academia se trasladó a sus instalaciones en Colina de San Sebastián (la Coronilla), con 6 bloques y más de 60 ambientes, inaugurados en 2010 con financiamiento japonés.',
      ],
    },
    {
      id: 'modernizacion',
      titulo: 'Modernización y Actualidad',
      layout: 'text',
      fondo: 'white',
      parrafos: [
        'La Ley N° 284 de 2012 declaró a la academia Patrimonio Cultural e Inmaterial del Estado Plurinacional de Bolivia.',
        'En 2015, una resolución ministerial la reconoció como Instituto de Formación Artística oficial.',
        'Actualmente ofrece formación musical desde los 3-6 años hasta niveles de educación superior.',
      ],
    },
    {
      id: 'embajada',
      titulo: 'Visita de la embajada Japonesa a la Academia',
      layout: 'gallery',
      fondo: 'palido',
      imagenes: [IMG.evento1, IMG.orquesta],
      parrafos: [],
    },
  ],
};

export const DEFAULT_CURSOS = [
  {
    id: 'PIANO-01',
    codigo: 'PIANO-01',
    nombre: 'Piano Forte',
    nivel: 'Medio',
    profesor: 'Prof. García',
    cuposOcupados: 15,
    cuposTotal: 20,
    estado: 'Activo',
    img: IMG.piano,
    descripcion: 'La especialidad más solicitada. Descubre la magia del piano junto a los mejores docentes.',
    destacado: true,
  },
  {
    id: 'VIOL-01',
    codigo: 'VIOL-01',
    nombre: 'Violín Clásico',
    nivel: 'Medio',
    profesor: 'Prof. Ríos',
    cuposOcupados: 8,
    cuposTotal: 12,
    estado: 'Activo',
    img: IMG.violin,
    descripcion: 'Uno de los instrumentos más dulces. Entra al mundo del violín en la música clásica.',
    destacado: true,
  },
  {
    id: 'GUIT-01',
    codigo: 'GUIT-01',
    nombre: 'Guitarra Clásica',
    nivel: 'Básico',
    profesor: 'Prof. Mendoza',
    cuposOcupados: 10,
    cuposTotal: 15,
    estado: 'Activo',
    img: IMG.guitarra,
    descripcion: 'Aprende guitarra clásica con docentes especializados.',
    destacado: true,
  },
];
