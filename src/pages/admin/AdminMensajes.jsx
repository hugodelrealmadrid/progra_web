import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminMensajes() {
  const { mensajes, marcarMensajeLeido } = useAdminData();

  const verMensaje = (msg) => {
    marcarMensajeLeido(msg.id);
    alert(`${msg.asunto}\n\nDe: ${msg.nombre} (${msg.email})\n\n${msg.mensaje}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mensajes de contacto</h1>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="bg-amc-oscuro text-white">
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Asunto</th>
              <th className="px-4 py-3 font-semibold">Leído</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((msg) => (
              <tr key={msg.id} className="border-t border-gray-100 bg-amc-palido/50 even:bg-white">
                <td className="px-4 py-3">{msg.fecha}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={msg.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    {msg.nombre}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{msg.email}</td>
                <td className="px-4 py-3">{msg.asunto}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={msg.leido ? 'Sí' : 'No'} />
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => verMensaje(msg)} className="rounded border border-gray-400 px-3 py-1 text-xs font-medium hover:bg-gray-50">
                    Ver mensaje
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
