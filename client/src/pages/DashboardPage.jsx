import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart2, CalendarCheck2, Wind } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import AccuracyOverview from "../components/dashboard/AccuracyOverview";
import GenerationComparisonChart from "../components/dashboard/GenerationComparisonChart";
import MetricCard from "../components/dashboard/MetricCard";
import {
  fetchAccuracyMonth,
  fetchDashboardSummary,
  fetchGenerationOverview
} from "../services/api";
import { formatMw, formatPercent } from "../utils/formatters";

function sanitizeRows(rows) {
  return rows.map((row) => ({
    ...row,
    generation_actual:
      row.generation_actual === null || row.generation_actual === undefined
        ? null
        : Number(row.generation_actual),
    generation_forecast:
      row.generation_forecast === null || row.generation_forecast === undefined
        ? null
        : Number(row.generation_forecast)
  }));
}

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [overviewMetrics, setOverviewMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryResponse, generationResponse, accuracyResponse] = await Promise.all([
        fetchDashboardSummary(),
        fetchGenerationOverview(),
        fetchAccuracyMonth()
      ]);

      setSummary(summaryResponse);
      setChartData(sanitizeRows(generationResponse));
      setOverviewMetrics(accuracyResponse);
    } catch (requestError) {
      const responseMessage = requestError?.response?.data?.detail;
      setError(
        responseMessage ||
          "Could not fetch dashboard data. Ensure backend routes /api/dashboard and /api/accuracy are available."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const cards = useMemo(
    () => [
      {
        title: "Average Actual Generation",
        value: formatMw(summary?.avg_actual_generation, 2),
        description: "Use this as the real baseline for planning and post-delivery performance checks.",
        icon: Wind
      },
      {
        title: "Average Forecast Generation",
        value: formatMw(summary?.avg_forecast_generation, 2),
        description: "Shows what procurement would have expected before delivery and where volume expectations were set.",
        icon: CalendarCheck2
      },
      {
        title: "Mean Absolute Error",
        value: formatMw(summary?.mae, 2),
        description: "Represents the typical miss size; higher values suggest keeping a larger risk buffer.",
        icon: Activity
      },
      {
        title: "Forecast Availability",
        value: formatPercent(summary?.forecast_availability, 2),
        description: "Indicates confidence in metric coverage; lower coverage means decisions rely on less complete forecast input.",
        icon: BarChart2
      }
    ],
    [summary]
  );

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!summary || !Array.isArray(chartData) || chartData.length === 0) {
    return <EmptyState message="No dashboard data available for January 2026." />;
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            description={card.description}
          />
        ))}
      </section>

      <GenerationComparisonChart data={chartData} />

      <AccuracyOverview metrics={overviewMetrics || summary} />

      <p className="rounded-xl border border-cardBorder bg-white px-3 py-2 text-xs text-muted shadow-soft">
        Note: Actual generation is half-hourly while available WINDFOR forecasts are hourly, so some actual intervals have no matching forecast.
      </p>
    </div>
  );
}

export default DashboardPage;
