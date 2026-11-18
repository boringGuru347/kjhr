function MetricCard({ icon: Icon, title, value, description }) {
  return (
    <article className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{value}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{description}</p>
        </div>
        <span className="rounded-lg bg-accentSoft p-2 text-accent">
          <Icon size={18} />
        </span>
      </div>
    </article>
  );
}

export default MetricCard;
