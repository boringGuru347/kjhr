function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-cardBorder bg-white p-6 text-sm text-muted shadow-soft">
      {message || "No data available for the selected parameters."}
    </div>
  );
}

export default EmptyState;
