import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAcademico } from '../../context/AcademicoContext';
import Toast from '../../components/Toast';

const CURSOS = ['Piano Básico', 'Violín Intermedio'];
const BIMESTRES = ['b1', 'b2', 'b3', 'b4'];
const BIMESTRE_LABEL = { b1: '1° Bimestre', b2: '2° Bimestre', b3: '3° Bimestre', b4: '4° Bimestre' };

export default function ProfesorCalificaciones() {
  const location = useLocation();
  const { calificaciones, saveCalificaciones, exportCalificacionesCSV, promedio, toast } = useAcademico();
  const [tab, setTab] = useState(location.state?.curso ?? 'Piano Básico');
  const [notas, setNotas] = useState([]);
  // pendingTimestamps: { [alumnoId]: { [bimestre]: 'DD/MM/YYYY HH:MM' } }
  const [pendingTimestamps, setPendingTimestamps] = useState({});
  const [tooltipInfo, setTooltipInfo] = useState(null); // { id, key, x, y }
  const tooltipRef = useRef(null);

  useEffect(() => {
    setNotas(calificaciones[tab] ?? []);
    setPendingTimestamps({});
  }, [tab, calificaciones]);

  const guardar = () => {
    saveCalificaciones(tab, notas, pendingTimestamps);
    setPendingTimestamps({});
  };

  const actualizarNota = (index, key, val) => {
    const ahora = new Date().toLocaleString('es-BO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    setNotas((prev) =>
      prev.map((n, i) => {
        if (i !== index) return n;
        return { ...n, [key]: val === '' ? null : Number(val) };
      })
    );
    setNotas((prev) => {
      const alumno = prev[index];
      if (!alumno) return prev;
      setPendingTimestamps((pts) => ({
        ...pts,
        [alumno.id]: { ...(pts[alumno.id] ?? {}), [key]: ahora },
      }));
      return prev;
    });
  };

  const getTimestamp = (alumno, key) => {
    // Preferir el pendiente (aún no guardado), sino el persistido en el objeto
    return pendingTimestamps[alumno.id]?.[key] ?? alumno._timestamps?.[key] ?? null;
  };

  return (
    <div>
      <Toast message={toast} />

      {/* Tooltip */}
      {tooltipInfo && (
        <div
          ref={tooltipRef}
          className="fixed z-50 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ top: tooltipInfo.y + 12, left: tooltipInfo.x }}
        >
          <p className="font-semibold text-gray-600">Última modificación</p>
          <p className="text-amc-oscuro">{tooltipInfo.ts}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calificaciones Bimestrales</h1>
          <p className="mt-1 text-sm text-gray-500">Materias colectivas — Cuatro bimestres por ciclo</p>
        </div>
        <button type="button" onClick={guardar} className="rounded-lg bg-amc-acento px-4 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
          Guardar Cambios
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CURSOS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-amc-oscuro text-white' : 'border border-gray-300 bg-white text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
        El 3° y 4° Bimestre aún no han sido registrados. La escala es de 0–100. 
        <span className="ml-2 font-medium">Pasa el cursor sobre 🕐 para ver la fecha de última edición.</span>
      </div>

      {/* Tabla desktop */}
      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-card sm:block">
        <div className="border-b border-gray-100 px-4 py-3 font-semibold text-amc-oscuro">
          🎹 {tab} — Calificaciones 2026
        </div>
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3">Alumno</th>
              {BIMESTRES.map((b) => (
                <th key={b} className="px-4 py-3">{BIMESTRE_LABEL[b]}</th>
              ))}
              <th className="px-4 py-3">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((a, i) => (
              <tr key={a.id ?? a.nombre} className="border-t border-gray-100 even:bg-amc-palido/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={a.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{a.nombre}</p>
                      {a._ultimaEdicion && (
                        <p className="text-xs text-gray-400">Guardado: {a._ultimaEdicion}</p>
                      )}
                    </div>
                  </div>
                </td>
                {BIMESTRES.map((key) => {
                  const ts = getTimestamp(a, key);
                  return (
                    <td key={key} className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={a[key] ?? ''}
                          onChange={(e) => actualizarNota(i, key, e.target.value)}
                          className={`w-16 rounded border px-2 py-1 text-sm ${a[key] != null && a[key] < 70 ? 'border-red-300 text-red-600' : 'border-gray-300'}`}
                        />
                        {ts && (
                          <span
                            className="cursor-pointer text-gray-400 hover:text-amc-verde"
                            onMouseEnter={(e) => setTooltipInfo({ id: a.id + key, key, ts, x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setTooltipInfo(null)}
                          >
                            🕐
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                <td className="px-4 py-3 font-bold text-amc-oscuro">{promedio(a) || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas móvil */}
      <div className="mt-6 space-y-4 sm:hidden">
        {notas.map((a, i) => (
          <div key={a.id ?? a.nombre} className="rounded-lg border border-gray-200 bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <img src={a.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-amc-oscuro">{a.nombre}</p>
                {a._ultimaEdicion && <p className="text-xs text-gray-400">Guardado: {a._ultimaEdicion}</p>}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {BIMESTRES.map((key) => {
                const ts = getTimestamp(a, key);
                return (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-gray-500">{BIMESTRE_LABEL[key]}</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={a[key] ?? ''}
                        onChange={(e) => actualizarNota(i, key, e.target.value)}
                        className={`w-full rounded border px-2 py-1.5 text-sm ${a[key] != null && a[key] < 70 ? 'border-red-300 text-red-600' : 'border-gray-300'}`}
                      />
                      {ts && <span className="text-xs text-gray-400" title={ts}>🕐</span>}
                    </div>
                    {ts && <p className="mt-0.5 text-xs text-gray-400">{ts}</p>}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm font-bold text-amc-oscuro">Promedio: {promedio(a) || '—'}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => exportCalificacionesCSV(tab)} className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
          Exportar CSV
        </button>
        <button type="button" onClick={guardar} className="rounded-lg bg-amc-acento px-5 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
          Guardar Calificaciones
        </button>
      </div>
    </div>
  );
}