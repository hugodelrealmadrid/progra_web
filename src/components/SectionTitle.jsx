export default function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`text-2xl font-bold text-amc-oscuro md:text-3xl ${className}`}>
      {children}
    </h2>
  );
}
