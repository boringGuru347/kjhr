import { formatMw, formatPercent } from "../../utils/formatters";

function AccuracyMetrics({ metrics }) {
  const cards = [
    {
      key: "mae",
      label: "MAE",
      value: formatMw(metrics?.mae, 2),
      hint: "Typical forecast miss size. Use this to set everyday procurement caution levels."
    },
    {
      key: "rmse",
      label: "RMSE",
      value: formatMw(metrics?.rmse, 2),
      hint: "Flags how costly bad days can be. A high value suggests occasional large misses that need stronger contingency planning."
    },
    {
      key: "bias",
      label: "Mean Bias Error",
      value: formatMw(metrics?.bias, 2),
      hint: "Shows consistent direction of error: positive means forecasts usually too high, negative means usually too low."
    },
    {
      key: "max_error",
      label: "Max Absolute Error",
      value: formatMw(metrics?.max_error, 2),
      hint: "Worst miss seen in the selected period. Use it to stress-test reserve and balancing readiness."
    },
    {
      key: "forecast_availability",
      label: "Forecast Availability",
      value: formatPercent(metrics?.forecast_availability, 2),
      hint: "How complete the forecast feed was. Lower coverage means performance conclusions should be treated more cautiously."
    }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article key={card.key} className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{card.label}</p>
          <p className="mt-2 text-xl font-extrabold text-ink">{card.value}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{card.hint}</p>
        </article>
      ))}
    </section>
  );
}

export default AccuracyMetrics;
