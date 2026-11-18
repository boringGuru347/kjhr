import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatMw, toDateTimeLabel, toTimeLabel } from "../../utils/formatters";

function DailyGenerationChart({ data }) {
  return (
    <section className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
      <h3 className="mb-1 text-base font-bold text-ink">Daily Generation Profile</h3>
      <p className="mb-3 text-sm text-muted">
        Missing forecast intervals are shown as gaps where no hourly forecast exists.
      </p>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e6edf3" strokeDasharray="3 3" />
            <XAxis
              dataKey="startTime"
              tickFormatter={(value) => toTimeLabel(value)}
              minTickGap={16}
              tick={{ fill: "#5f6b7a", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#5f6b7a", fontSize: 12 }}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              label={{ value: "MW", angle: -90, position: "insideLeft", fill: "#5f6b7a" }}
            />
            <Tooltip
              labelFormatter={(label) => toDateTimeLabel(label)}
              formatter={(value, name, item) => {
                const seriesLabel =
                  item?.dataKey === "generation_actual" || name === "Actual"
                    ? "Actual"
                    : "Forecast";
                if (value === null || value === undefined) {
                  return ["Unavailable", seriesLabel];
                }
                return [formatMw(value, 0), seriesLabel];
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="generation_actual"
              stroke="#10233e"
              strokeWidth={2}
              dot={false}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="generation_forecast"
              stroke="#1f8c4a"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="Forecast"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default DailyGenerationChart;
