import { IMG } from '../data/images';

export default function Contacto() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-800 bg-cover bg-center px-6 py-16"
      style={{ backgroundImage: `url('${IMG.edificio}')` }}
    >
      {/* Overlay oscuro — sin etiqueta <img> para evitar icono roto */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl">Contacto Principal</h1>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/95 md:text-base">
          <p>
            Para comunicarse con la academia rellene los datos de abajo realizando la solicitud
            de lo que desea saber o preguntar. Recuerde que estamos con toda la disposición para
            atenderlo/a.
          </p>
          <p>
            En caso de desear hablar con la Secretaria o algún administrativo, especifique abajo
            para así poder agendar una reunión con la persona que esté buscando.
          </p>
          <p>En caso de tener problemas será avisada con tiempo. Muchas gracias por su paciencia!!</p>
        </div>

        <div className="mt-10">
          <h2 className="text-center text-xl font-bold text-white">Información de Contacto</h2>

          <form className="mx-auto mt-6 max-w-xl space-y-5 text-center" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 text-left md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Nombres</label>
                <input
                  type="text"
                  placeholder="Jane"
                  className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Apellidos</label>
                <input
                  type="text"
                  placeholder="Smitherton"
                  className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                placeholder="email@janesfakedomain.net"
                className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">Escriba su mensaje</label>
              <textarea
                rows={6}
                placeholder="Escriba aquí su consulta..."
                className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="rounded-lg bg-white px-10 py-3.5 text-sm font-bold text-amc-oscuro shadow-sm hover:bg-amc-palido"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
