function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-cardBorder bg-white shadow-soft">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-accent" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export default LoadingState;
