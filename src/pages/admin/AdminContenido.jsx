import { useEffect, useState } from 'react';
import { useContenido } from '../../context/ContenidoContext';
import { saveGeneral, saveHistoria } from '../../services/contenidoService';
import { DEFAULT_HISTORIA } from '../../data/contenidoDefaults';

export default function AdminContenido() {
  const { general, historia, firebaseStatus } = useContenido();
  const [tab, setTab] = useState('general');
  const [formGeneral, setFormGeneral] = useState(general);
  const [formHistoria, setFormHistoria] = useState(historia);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => setFormGeneral(general), [general]);
  useEffect(() => setFormHistoria(historia), [historia]);

  const handleImage = (setter, field) => (e) => {
    const file = e.target.files?.[0];
    if (file) setter((f) => ({ ...f, [field]: URL.createObjectURL(file) }));
  };

  const guardarGeneral = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await saveGeneral(formGeneral);
      setMsg('Página General guardada correctamente.');
    } catch {
      setMsg('Error al guardar. Revisa la configuración de Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const guardarHistoria = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await saveHistoria(formHistoria);
      setMsg('Página Historia guardada correctamente.');
    } catch {
      setMsg('Error al guardar. Revisa la configuración de Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const actualizarSeccion = (index, campo, valor) => {
    setFormHistoria((h) => {
      const secciones = [...(h.secciones || [])];
      secciones[index] = { ...secciones[index], [campo]: valor };
      return { ...h, secciones };
    });
  };

  const actualizarParrafos = (index, texto) => {
    const parrafos = texto.split('\n\n').map((p) => p.trim()).filter(Boolean);
    actualizarSeccion(index, 'parrafos', parrafos);
  };

  const restaurarHistoria = () => {
    setFormHistoria(DEFAULT_HISTORIA);
    setMsg('Contenido restaurado a valores por defecto (guarda para aplicar).');
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contenido dinámico del sitio</h1>
          <p className="mt-1 text-sm text-gray-500">
            Almacenamiento:{' '}
            <span className="font-medium text-amc-verde">
              {firebaseStatus.configured ? 'Firestore (en línea)' : 'Local (sin Firebase)'}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { id: 'general', label: 'Página General' },
          { id: 'historia', label: 'Página Historia' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setMsg('');
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              tab === t.id
                ? 'bg-amc-oscuro text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <p className={`mt-4 text-sm ${msg.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {msg}
        </p>
      )}

      {tab === 'general' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-amc-oscuro">Hero principal</h2>
            <form className="mt-5 space-y-4" onSubmit={guardarGeneral}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Título</label>
                <input
                  value={formGeneral.titulo}
                  onChange={(e) => setFormGeneral({ ...formGeneral, titulo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Subtítulo</label>
                <textarea
                  rows={3}
                  value={formGeneral.subtitulo}
                  onChange={(e) => setFormGeneral({ ...formGeneral, subtitulo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Texto botón</label>
                  <input
                    value={formGeneral.boton}
                    onChange={(e) => setFormGeneral({ ...formGeneral, boton: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Enlace botón</label>
                  <input
                    value={formGeneral.botonLink || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, botonLink: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="/ofertas"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Imagen principal (URL)</label>
                  <input
                    value={formGeneral.imagen || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, imagen: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage(setFormGeneral, 'imagen')}
                    className="mt-2 w-full text-sm text-gray-600"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Imagen secundaria (URL)</label>
                  <input
                    value={formGeneral.imagenSecundaria || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, imagenSecundaria: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage(setFormGeneral, 'imagenSecundaria')}
                    className="mt-2 w-full text-sm text-gray-600"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-amc-oscuro px-5 py-2.5 text-sm font-semibold text-white hover:bg-amc-verde disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar página General'}
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-amc-oscuro">Llamada a la acción (CTA)</h2>
            <form className="mt-5 space-y-4" onSubmit={guardarGeneral}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Título CTA</label>
                <input
                  value={formGeneral.ctaTitulo || ''}
                  onChange={(e) => setFormGeneral({ ...formGeneral, ctaTitulo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Subtítulo CTA</label>
                <input
                  value={formGeneral.ctaSubtitulo || ''}
                  onChange={(e) => setFormGeneral({ ...formGeneral, ctaSubtitulo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Botón 1</label>
                  <input
                    value={formGeneral.ctaBoton1 || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, ctaBoton1: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={formGeneral.ctaBoton1Link || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, ctaBoton1Link: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="/ofertas"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Botón 2</label>
                  <input
                    value={formGeneral.ctaBoton2 || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, ctaBoton2: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={formGeneral.ctaBoton2Link || ''}
                    onChange={(e) => setFormGeneral({ ...formGeneral, ctaBoton2Link: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="/contacto"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-amc-oscuro px-5 py-2.5 text-sm font-semibold text-white hover:bg-amc-verde disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar CTA'}
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 'historia' && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-amc-oscuro">Página Historia — secciones editables</h2>
            <button
              type="button"
              onClick={restaurarHistoria}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Restaurar valores por defecto
            </button>
          </div>

          <form className="mt-5 space-y-6" onSubmit={guardarHistoria}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Título de la página</label>
              <input
                value={formHistoria.titulo || ''}
                onChange={(e) => setFormHistoria({ ...formHistoria, titulo: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Introducción</label>
              <textarea
                rows={2}
                value={formHistoria.intro || ''}
                onChange={(e) => setFormHistoria({ ...formHistoria, intro: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Imagen hero (URL)</label>
              <input
                value={formHistoria.imagenHero || ''}
                onChange={(e) => setFormHistoria({ ...formHistoria, imagenHero: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {(formHistoria.secciones || []).map((seccion, index) => (
              <div key={seccion.id || index} className="rounded-lg border border-amc-claro bg-amc-palido/40 p-4">
                <h3 className="font-bold text-amc-oscuro">Sección {index + 1}: {seccion.titulo}</h3>
                <div className="mt-3 space-y-3">
                  <input
                    value={seccion.titulo || ''}
                    onChange={(e) => actualizarSeccion(index, 'titulo', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    placeholder="Título de sección"
                  />
                  {seccion.layout !== 'gallery' && (
                    <textarea
                      rows={5}
                      value={(seccion.parrafos || []).join('\n\n')}
                      onChange={(e) => actualizarParrafos(index, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder="Un párrafo por bloque (separados por línea en blanco)"
                    />
                  )}
                  {seccion.layout === 'image-right' && (
                    <input
                      value={seccion.imagen || ''}
                      onChange={(e) => actualizarSeccion(index, 'imagen', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder="URL de imagen"
                    />
                  )}
                  {seccion.layout === 'gallery' && (
                    <input
                      value={(seccion.imagenes || []).join(', ')}
                      onChange={(e) =>
                        actualizarSeccion(
                          index,
                          'imagenes',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder="URLs separadas por coma"
                    />
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amc-oscuro px-5 py-2.5 text-sm font-semibold text-white hover:bg-amc-verde disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar página Historia'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
