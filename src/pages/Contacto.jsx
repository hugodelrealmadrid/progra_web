import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { IMG } from '../data/images';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', mensaje: '' });
  const [estado, setEstado] = useState(''); // 'enviando' | 'ok' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    setErrorMsg('');

    if (!isFirebaseConfigured) {
      // Modo demo sin Firebase
      await new Promise((r) => setTimeout(r, 800));
      setEstado('ok');
      setForm({ nombre: '', apellidos: '', email: '', mensaje: '' });
      return;
    }

    try {
      await addDoc(collection(db, 'mensajes'), {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim(),
        mensaje: form.mensaje.trim(),
        leido: false,
        creadoEn: serverTimestamp(),
      });
      setEstado('ok');
      setForm({ nombre: '', apellidos: '', email: '', mensaje: '' });
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setErrorMsg('No se pudo enviar el mensaje. Intenta de nuevo.');
      setEstado('error');
    }
  };

  return (
    <section
      className="relative flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-800 bg-cover bg-center px-6 py-16"
      style={{ backgroundImage: `url('${IMG.edificio}')` }}
    >
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

          {estado === 'ok' ? (
            <div className="mx-auto mt-8 max-w-md rounded-lg bg-white/10 p-6 text-white">
              <p className="text-lg font-semibold">✅ Mensaje enviado correctamente</p>
              <p className="mt-2 text-sm text-white/80">Nos pondremos en contacto pronto.</p>
              <button
                onClick={() => setEstado('')}
                className="mt-4 rounded-lg bg-white px-6 py-2 text-sm font-bold text-amc-oscuro hover:bg-amc-palido"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className="mx-auto mt-6 max-w-xl space-y-5 text-center" onSubmit={handleSubmit}>
              <div className="grid gap-5 text-left md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white">Nombres</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Jane"
                    required
                    className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    placeholder="Smitherton"
                    required
                    className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@ejemplo.com"
                  required
                  className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Escriba su mensaje</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Escriba aquí su consulta..."
                  required
                  className="w-full rounded-lg border-0 px-4 py-3 text-sm text-gray-900 shadow-sm"
                />
              </div>

              {errorMsg && <p className="text-sm text-red-300">{errorMsg}</p>}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="rounded-lg bg-white px-10 py-3.5 text-sm font-bold text-amc-oscuro shadow-sm hover:bg-amc-palido disabled:opacity-60"
                >
                  {estado === 'enviando' ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
