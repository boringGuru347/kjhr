const gbDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "2-digit",
  month: "short",
  year: "numeric"
});

const gbTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const gbDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

export function formatNumber(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(Number(value));
}

export function formatMw(value, digits = 0) {
  return `${formatNumber(value, digits)} MW`;
}

export function formatPercent(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return `${formatNumber(value, digits)}%`;
}

export function toDateLabel(isoString) {
  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return gbDateFormatter.format(value);
}

export function toTimeLabel(isoString) {
  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return gbTimeFormatter.format(value);
}

export function toDateTimeLabel(isoString) {
  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return gbDateTimeFormatter.format(value);
}

export function normalizeDateInput(isoString) {
  if (!isoString) {
    return "";
  }

  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    year: "numeric"
  });
  const month = value.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    month: "2-digit"
  });
  const day = value.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    day: "2-digit"
  });

  return `${year}-${month}-${day}`;
}
