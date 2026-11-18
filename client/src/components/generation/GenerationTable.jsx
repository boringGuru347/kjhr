import { formatMw, toDateTimeLabel } from "../../utils/formatters";

function GenerationTable({ rows }) {
  return (
    <section className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
      <h3 className="mb-3 text-base font-bold text-ink">Interval Data</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-cardBorder px-3 py-2 font-semibold text-muted">
                Delivery Time
              </th>
              <th className="border-b border-cardBorder px-3 py-2 font-semibold text-muted">
                Actual Generation (MW)
              </th>
              <th className="border-b border-cardBorder px-3 py-2 font-semibold text-muted">
                Forecast Generation (MW)
              </th>
              <th className="border-b border-cardBorder px-3 py-2 font-semibold text-muted">
                Forecast Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasForecast = row.generation_forecast !== null && row.generation_forecast !== undefined;
              return (
                <tr key={row.startTime} className="odd:bg-slate-50/70">
                  <td className="border-b border-cardBorder px-3 py-2 text-ink">{toDateTimeLabel(row.startTime)}</td>
                  <td className="border-b border-cardBorder px-3 py-2 text-ink">
                    {formatMw(row.generation_actual, 0)}
                  </td>
                  <td className="border-b border-cardBorder px-3 py-2 text-ink">
                    {hasForecast ? formatMw(row.generation_forecast, 0) : "-"}
                  </td>
                  <td className="border-b border-cardBorder px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        hasForecast
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {hasForecast ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GenerationTable;
