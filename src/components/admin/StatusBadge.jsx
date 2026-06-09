export default function StatusBadge({ value, type = 'default' }) {
  const styles = {
    pagado: 'bg-green-100 text-green-700',
    pendiente: 'bg-red-100 text-red-600',
    activo: 'bg-green-100 text-green-700',
    si: 'bg-green-100 text-green-700',
    no: 'bg-red-100 text-red-600',
    default: 'bg-gray-100 text-gray-700',
  };

  const key = value?.toLowerCase().replace('í', 'i');
  const cls = styles[key] ?? styles[type] ?? styles.default;

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}
