export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-amc-oscuro',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-lg ${colors[type]} px-5 py-3 text-sm font-medium text-white shadow-lg`}>
      {message}
    </div>
  );
}
