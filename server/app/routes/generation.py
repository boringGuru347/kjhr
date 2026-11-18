from fastapi import APIRouter
import numpy as np
from app.services.data_service import get_generation_by_date
from app.services.data_service import get_all
from app.services.data_service import get_dates

router = APIRouter()


def _to_json_safe_records(df):
    # FastAPI/Starlette JSON responses reject NaN/Infinity, so coerce them to null.
    sanitized = df.replace([np.inf, -np.inf], np.nan)
    sanitized = sanitized.astype(object).where(sanitized.notna(), None)
    return sanitized.to_dict(orient="records")

@router.get("/")
def get_generation(date: str):
    result = get_generation_by_date(date)
    return _to_json_safe_records(result)


@router.get("/overview")
def get_month_data():
    result = get_all()
    return _to_json_safe_records(result)


@router.get("/dates")
def get_month_dates():
    result = get_dates()
    return result