import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMw, formatPercent } from "../../utils/formatters";

function AccuracyOverview({ metrics }) {
  const items = [
    { label: "MAE", value: formatMw(metrics?.mae, 2) },
    { label: "RMSE", value: formatMw(metrics?.rmse, 2) },
    { label: "Bias", value: formatMw(metrics?.bias, 2) },
    {
      label: "Forecast Availability",
      value: formatPercent(metrics?.forecast_availability, 2)
    }
  ];

  return (
    <section className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-ink">Forecast Accuracy Overview</h3>
          <p className="text-sm text-muted">Snapshot of available January accuracy metrics.</p>
        </div>
        <Link
          to="/forecast-accuracy"
          className="inline-flex items-center gap-1 rounded-md border border-cardBorder px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-50"
        >
          View details
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-cardBorder p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</p>
            <p className="mt-1 text-lg font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AccuracyOverview;
