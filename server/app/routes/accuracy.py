from fastapi import APIRouter
from app.services.data_service import get_metrics
from app.services.data_service import get_trend as get_trend_data

router = APIRouter()


# @router.get('')
@router.get('/')
def calculate_metrics(startDate: str, endDate: str):
    result = get_metrics(startDate, endDate)
    return result


@router.get('/month')
def get_month_data():
    return get_metrics('2026-01-01', '2026-01-31')


@router.get('/trend')
def get_trend(startDate: str, endDate: str):
    result = get_trend_data(startDate, endDate)
    return result
