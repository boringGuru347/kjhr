import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

function parseMaybeStringifiedJson(payload) {
  if (typeof payload !== "string") {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function normalizeDateList(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (Array.isArray(item)) {
        return item[0];
      }
      return item;
    })
    .filter(Boolean);
}

export async function fetchDashboardSummary() {
  const { data } = await client.get("/api/dashboard/summary");
  return parseMaybeStringifiedJson(data);
}

export async function fetchGenerationOverview() {
  const { data } = await client.get("/api/generation/overview");
  const parsed = parseMaybeStringifiedJson(data);
  return Array.isArray(parsed) ? parsed : [];
}

export async function fetchGenerationByDate(date) {
  const { data } = await client.get("/api/generation", {
    params: { date }
  });
  const parsed = parseMaybeStringifiedJson(data);
  return Array.isArray(parsed) ? parsed : [];
}

export async function fetchGenerationDates() {
  const { data } = await client.get("/api/generation/dates");
  const parsed = parseMaybeStringifiedJson(data);
  return normalizeDateList(parsed);
}

export async function fetchAccuracyMonth() {
  try {
    const { data } = await client.get("/api/accuracy/month");
    return parseMaybeStringifiedJson(data);
  } catch {
    const { data } = await client.get("/api/accuracy/", {
      params: {
        startDate: "2026-01-01",
        endDate: "2026-01-31"
      }
    });
    return parseMaybeStringifiedJson(data);
  }
}

export async function fetchAccuracyMetrics(startDate, endDate) {
  const { data } = await client.get("/api/accuracy/", {
    params: { startDate, endDate }
  });
  return parseMaybeStringifiedJson(data);
}

export async function fetchAccuracyTrend(startDate, endDate) {
  const { data } = await client.get("/api/accuracy/trend", {
    params: { startDate, endDate }
  });
  const parsed = parseMaybeStringifiedJson(data);
  return Array.isArray(parsed) ? parsed : [];
}

export { API_BASE_URL };
