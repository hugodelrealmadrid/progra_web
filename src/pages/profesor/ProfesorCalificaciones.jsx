import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAcademico } from '../../context/AcademicoContext';
import Toast from '../../components/Toast';

const CURSOS = ['Piano Básico', 'Violín Intermedio'];

export default function ProfesorCalificaciones() {
  const location = useLocation();
  const { calificaciones, saveCalificaciones, exportCalificacionesCSV, promedio, toast } = useAcademico();
  const [tab, setTab] = useState(location.state?.curso ?? 'Piano Básico');
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    setNotas(calificaciones[tab] ?? []);
  }, [tab, calificaciones]);

  const guardar = () => {
    saveCalificaciones(tab, notas);
  };

  const actualizarNota = (index, key, val) => {
    setNotas((prev) =>
      prev.map((n, i) => (i === index ? { ...n, [key]: val === '' ? null : Number(val) } : n))
    );
  };

  return (
    <div>
      <Toast message={toast} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calificaciones Bimestrales</h1>
          <p className="mt-1 text-sm text-gray-500">Materias colectivas — Cuatro bimestres por ciclo</p>
        </div>
        <button type="button" onClick={guardar} className="rounded-lg bg-amc-acento px-4 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
          Guardar Cambios
        </button>
      </div>

      <div className="mt-5 flex gap-2">
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
        El 3° y 4° Bimestre aún no han sido registrados. La escala es de 0-100.
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-card">
        <div className="border-b border-gray-100 px-4 py-3 font-semibold text-amc-oscuro">
          🎹 {tab} — Calificaciones 2026
        </div>
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3">Alumno</th>
              <th className="px-4 py-3">1° Bimestre</th>
              <th className="px-4 py-3">2° Bimestre</th>
              <th className="px-4 py-3">3° Bimestre</th>
              <th className="px-4 py-3">4° Bimestre</th>
              <th className="px-4 py-3">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((a, i) => (
              <tr key={a.id ?? a.nombre} className="border-t border-gray-100 even:bg-amc-palido/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={a.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    {a.nombre}
                  </div>
                </td>
                {['b1', 'b2', 'b3', 'b4'].map((key) => (
                  <td key={key} className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={a[key] ?? ''}
                      onChange={(e) => actualizarNota(i, key, e.target.value)}
                      className={`w-16 rounded border px-2 py-1 text-sm ${a[key] != null && a[key] < 70 ? 'border-red-300 text-red-600' : 'border-gray-300'}`}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 font-bold text-amc-oscuro">{promedio(a) || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-3">
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
