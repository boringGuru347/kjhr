import { BarChart3, Gauge, Menu, Wind, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: Gauge },
  { label: "Generation", to: "/generation", icon: Wind },
  { label: "Forecast Accuracy", to: "/forecast-accuracy", icon: BarChart3 }
];

function Sidebar({ isOpen, onClose, onOpen }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-accent text-white"
        : "text-muted hover:bg-slate-100 hover:text-ink"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="fixed left-4 top-4 z-30 rounded-lg border border-cardBorder bg-white p-2 text-ink shadow-soft lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          aria-label="Close navigation backdrop"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-cardBorder bg-white px-5 py-6 shadow-soft transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">GridBricks</p>
            <h1 className="text-xl font-extrabold text-ink">Energy Analytics</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-slate-100 hover:text-ink lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={onClose}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 rounded-lg border border-cardBorder bg-accentSoft p-3 text-xs text-muted">
          UK national wind generation for January 2026.
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
