import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatMw } from "../../utils/formatters";

function AccuracyTrendChart({ data }) {
  return (
    <section className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
      <h3 className="mb-1 text-base font-bold text-ink">Daily MAE Trend</h3>
      <p className="mb-3 text-sm text-muted">
        Daily mean absolute error for matched forecast and actual intervals.
      </p>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e6edf3" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#5f6b7a", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#5f6b7a", fontSize: 12 }}
              tickFormatter={(value) => `${Math.round(value)}`}
              label={{ value: "MW", angle: -90, position: "insideLeft", fill: "#5f6b7a" }}
            />
            <Tooltip
              formatter={(value) => [formatMw(value, 2), "MAE"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="mae"
              stroke="#1f8c4a"
              strokeWidth={2.5}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              name="Daily MAE"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default AccuracyTrendChart;
