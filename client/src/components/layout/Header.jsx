function Header({ title, description }) {
  return (
    <header className="mb-5 rounded-2xl border border-cardBorder bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-cardBorder bg-slate-50 px-3 py-1 text-xs font-semibold text-ink">
            Data Period: January 2026
          </span>
          <span className="rounded-full border border-cardBorder bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
            UK National Wind Generation
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
