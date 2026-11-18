import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import DailyGenerationChart from "../components/generation/DailyGenerationChart";
import DateSelector from "../components/generation/DateSelector";
import GenerationTable from "../components/generation/GenerationTable";
import { fetchGenerationByDate, fetchGenerationDates } from "../services/api";

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

function GenerationPage() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [error, setError] = useState("");

  const loadDates = useCallback(async () => {
    setLoadingDates(true);
    setError("");

    try {
      const values = await fetchGenerationDates();
      setDates(values);
      if (values.length > 0) {
        setSelectedDate((previous) => previous || values[0]);
      }
    } catch (requestError) {
      const responseMessage = requestError?.response?.data?.detail;
      setError(responseMessage || "Failed to load available dates.");
    } finally {
      setLoadingDates(false);
    }
  }, []);

  const loadRows = useCallback(async (date) => {
    if (!date) {
      return;
    }

    setLoadingRows(true);
    setError("");

    try {
      const data = await fetchGenerationByDate(date);
      setRows(sanitizeRows(data));
    } catch (requestError) {
      const responseMessage = requestError?.response?.data?.detail;
      setError(responseMessage || "Failed to load generation intervals for selected date.");
    } finally {
      setLoadingRows(false);
    }
  }, []);

  useEffect(() => {
    loadDates();
  }, [loadDates]);

  useEffect(() => {
    if (selectedDate) {
      loadRows(selectedDate);
    }
  }, [selectedDate, loadRows]);

  const hasData = useMemo(() => rows.length > 0, [rows]);

  if (loadingDates) {
    return <LoadingState label="Loading generation dates..." />;
  }

  if (error && !dates.length) {
    return <ErrorState message={error} onRetry={loadDates} />;
  }

  return (
    <div className="space-y-4">
      <DateSelector dates={dates} value={selectedDate} onChange={setSelectedDate} />

      {error && <ErrorState message={error} onRetry={() => loadRows(selectedDate)} />}

      {loadingRows ? (
        <LoadingState label="Loading generation profile..." />
      ) : hasData ? (
        <>
          <DailyGenerationChart data={rows} />
          <GenerationTable rows={rows} />
        </>
      ) : (
        <EmptyState message="No generation data available for the selected date." />
      )}

      <p className="rounded-xl border border-cardBorder bg-white px-3 py-2 text-xs text-muted shadow-soft">
        Forecast coverage is hourly while actual generation is half-hourly, so table and charts intentionally include intervals without forecast values.
      </p>
    </div>
  );
}

export default GenerationPage;
