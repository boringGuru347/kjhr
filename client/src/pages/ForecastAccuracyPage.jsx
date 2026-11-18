import { useCallback, useEffect, useMemo, useState } from "react";
import AccuracyMetrics from "../components/accuracy/AccuracyMetrics";
import AccuracyTrendChart from "../components/accuracy/AccuracyTrendChart";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import { fetchAccuracyMetrics, fetchAccuracyTrend } from "../services/api";

const JAN_START = "2026-01-01";
const JAN_END = "2026-01-31";

function ForecastAccuracyPage() {
  const [startDate, setStartDate] = useState(JAN_START);
  const [endDate, setEndDate] = useState(JAN_END);
  const [metrics, setMetrics] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [metricsData, trendData] = await Promise.all([
        fetchAccuracyMetrics(startDate, endDate),
        fetchAccuracyTrend(startDate, endDate)
      ]);
      setMetrics(metricsData);
      setTrend(trendData);
    } catch (requestError) {
      const responseMessage = requestError?.response?.data?.detail;
      setError(responseMessage || "Failed to load forecast accuracy data.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rangeLabel = useMemo(() => {
    if (startDate === endDate) {
      return `Single day: ${startDate}`;
    }
    return `${startDate} to ${endDate}`;
  }, [startDate, endDate]);

  if (loading) {
    return <LoadingState label="Loading forecast accuracy..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!metrics || metrics.message) {
    return <EmptyState message={metrics?.message || "No accuracy metrics available."} />;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-ink">Date Range Filter</h3>
          <p className="text-xs text-muted">Selected range: {rangeLabel}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-semibold text-ink">
            Start date
            <input
              type="date"
              min={JAN_START}
              max={JAN_END}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-cardBorder px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
          </label>

          <label className="text-sm font-semibold text-ink">
            End date
            <input
              type="date"
              min={startDate || JAN_START}
              max={JAN_END}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-cardBorder px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setStartDate(JAN_START);
              setEndDate(JAN_END);
            }}
            className="self-end rounded-lg border border-cardBorder px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
          >
            Full January 2026
          </button>

          <button
            type="button"
            onClick={() => setEndDate(startDate)}
            className="self-end rounded-lg border border-cardBorder px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
          >
            Single Day Mode
          </button>
        </div>
      </section>

      <AccuracyMetrics metrics={metrics} />

      {trend.length > 0 ? (
        <AccuracyTrendChart data={trend} />
      ) : (
        <EmptyState message="No trend data available for the selected range." />
      )}

      <section className="rounded-2xl border border-cardBorder bg-white p-4 text-sm text-muted shadow-soft">
        <h3 className="text-base font-bold text-ink">How to interpret these metrics</h3>
        <p className="mt-2">
          MAE tells you the miss size you should expect on a normal day. RMSE helps you judge whether bad error days are frequent enough to require stronger operational buffers.
        </p>
        <p className="mt-2">
          Bias tells you the direction the forecast usually leans. Positive values mean generation is often overcalled, while negative values mean it is often undercalled.
        </p>
        <p className="mt-2">
          Forecast availability shows how reliable the underlying data coverage is. Lower availability means conclusions are based on fewer comparable intervals and should be treated with more caution.
        </p>
      </section>
    </div>
  );
}

export default ForecastAccuracyPage;
