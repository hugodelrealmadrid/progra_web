export default function PanelSectionTitle({ children }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold text-amc-oscuro">
      <span className="h-8 w-1 rounded bg-amc-oscuro" />
      {children}
    </h2>
  );
}
