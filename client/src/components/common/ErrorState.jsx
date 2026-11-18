function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-soft">
      <p className="text-sm font-semibold">Unable to load data</p>
      <p className="mt-1 text-sm">{message || "Please check backend availability and try again."}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
