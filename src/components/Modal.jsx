export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-amc-oscuro">{title}</h3>
          <button type="button" onClick={onClose} className="text-xl text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
