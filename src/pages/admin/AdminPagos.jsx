import { useState } from 'react';
import { IMG } from '../../data/images';
import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminPagos() {
  const { pagos, confirmarPago, addPago } = useAdminData();
  const [nuevo, setNuevo] = useState({ estudiante: '', curso: '', monto: 'Bs. 350', metodo: 'Efectivo' });

  const handleRegistrar = () => {
    if (!nuevo.estudiante || !nuevo.curso) return;
    addPago({
      ...nuevo,
      fecha: new Date().toLocaleDateString('es-BO'),
      estado: 'Pendiente',
      avatar: IMG.piano,
    });
    setNuevo({ estudiante: '', curso: '', monto: 'Bs. 350', metodo: 'Efectivo' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
        <button type="button" onClick={handleRegistrar} className="rounded-lg bg-amc-oscuro px-4 py-2 text-sm font-semibold text-white hover:bg-amc-verde">
          + Registrar pago
        </button>
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-gray-200 bg-amc-palido/30 p-4 md:grid-cols-4">
        <input placeholder="Estudiante" value={nuevo.estudiante} onChange={(e) => setNuevo({ ...nuevo, estudiante: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Curso" value={nuevo.curso} onChange={(e) => setNuevo({ ...nuevo, curso: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Monto" value={nuevo.monto} onChange={(e) => setNuevo({ ...nuevo, monto: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <select value={nuevo.metodo} onChange={(e) => setNuevo({ ...nuevo, metodo: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option>Efectivo</option>
          <option>Transferencia</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3 font-semibold">Estudiante</th>
              <th className="px-4 py-3 font-semibold">Curso</th>
              <th className="px-4 py-3 font-semibold">Monto</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Método</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={pago.avatar ?? "/favicon.ico"} alt="" className="h-8 w-8 rounded-full object-cover" onError={(e)=>{e.target.style.display="none"}} />
                    {pago.estudiante}
                  </div>
                </td>
                <td className="px-4 py-3">{pago.curso}</td>
                <td className="px-4 py-3 font-medium">{pago.monto}</td>
                <td className="px-4 py-3">{pago.fecha}</td>
                <td className="px-4 py-3">{pago.metodo}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={pago.estado} />
                </td>
                <td className="px-4 py-3">
                  {pago.estado === 'Pagado' ? (
                    <button type="button" className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50">
                      Ver
                    </button>
                  ) : (
                    <button type="button" onClick={() => confirmarPago(pago.id)} className="rounded bg-amc-oscuro px-3 py-1 text-xs font-medium text-white hover:bg-amc-verde">
                      Confirmar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
