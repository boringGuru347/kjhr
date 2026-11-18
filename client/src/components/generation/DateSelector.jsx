function DateSelector({ dates, value, onChange }) {
  return (
    <div className="rounded-2xl border border-cardBorder bg-white p-4 shadow-soft">
      <label htmlFor="delivery-date" className="mb-2 block text-sm font-semibold text-ink">
        Select Delivery Date
      </label>
      <select
        id="delivery-date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-cardBorder bg-white px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2"
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DateSelector;
