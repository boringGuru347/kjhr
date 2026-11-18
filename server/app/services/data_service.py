import numpy as np
import pandas as pd

df = pd.read_csv("data/wind_generation.csv")
df["startTime"] = pd.to_datetime(df["startTime"], utc=True)


def get_generation_by_date(date: str):
    selected_date = pd.to_datetime(date).date()
    result = df[df["startTime"].dt.date == selected_date]
    return result


def get_all():
    result = df
    return df


def get_dates():
    return df["startTime"].dt.strftime("%Y-%m-%d").drop_duplicates().tolist()


def get_metrics(startDate: str, endDate: str):

    start = pd.to_datetime(startDate, utc=True)
    end = pd.to_datetime(endDate, utc=True) + pd.Timedelta(days=1)
    data = df[(df["startTime"] >= start) & (df["startTime"] < end)].copy()
    data = data.dropna(subset=["generation_actual", "generation_forecast"])

    if data.empty:
        return {"message": "No matching forecast data available"}

    actual = data["generation_actual"]
    forecast = data["generation_forecast"]

    errors = forecast - actual

    mae = np.mean(np.abs(errors))
    rmse = np.sqrt(np.mean(errors**2))
    bias = np.mean(errors)
    max_error = np.max(np.abs(errors))

    total_intervals = len(df[(df["startTime"] >= start) & (df["startTime"] < end)])

    availability = (len(data) / total_intervals) * 100

    return {
        "start_date": startDate,
        "end_date": endDate,
        "matched_intervals": len(data),
        "forecast_availability": round(availability, 2),
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2),
        "bias": round(float(bias), 2),
        "max_error": round(float(max_error), 2),
    }


def get_trend(startDate: str, endDate: str):
    start = pd.to_datetime(startDate, utc=True)
    end = pd.to_datetime(endDate, utc=True) + pd.Timedelta(days=1)

    data = df[(df["startTime"] >= start) & (df["startTime"] < end)].copy()

    data = data.dropna(subset=["generation_actual", "generation_forecast"])

    data["date"] = data["startTime"].dt.strftime("%Y-%m-%d")
    data["absolute_error"] = (
        data["generation_forecast"] - data["generation_actual"]
    ).abs()

    trend = (
        data.groupby("date")
        .agg(
            mae=("absolute_error", "mean"),
            avg_actual=("generation_actual", "mean"),
            avg_forecast=("generation_forecast", "mean"),
            matched_intervals=("absolute_error", "count"),
        )
        .reset_index()
    )

    return trend.to_dict(orient="records")

def get_dashboard_summary():
    actual_data = df["generation_actual"].dropna()
    forecast_data = df["generation_forecast"].dropna()

    total_intervals = len(df)

    matched = df.dropna(
        subset=["generation_actual", "generation_forecast"]
    )

    if matched.empty:
        return {"message": "No matching forecast data available"}

    errors = (
        matched["generation_forecast"]
        - matched["generation_actual"]
    )

    return {
        "avg_actual_generation": round(float(actual_data.mean()), 2),
        "avg_forecast_generation": round(float(forecast_data.mean()), 2),
        "mae": round(float(errors.abs().mean()), 2),
        "forecast_availability": round(
            len(matched) / total_intervals * 100, 2
        ),
        "total_intervals": total_intervals,
        "matched_intervals": len(matched)
    }
