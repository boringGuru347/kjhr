# GridBricks — Wind Energy Analytics

A full-stack energy analytics dashboard built as part of the GridBricks Full Stack Software Engineering Hiring Challenge.

The application helps UK energy procurement teams understand wind generation forecasts, compare them against actual generation, and quantitatively evaluate forecast accuracy to support day-ahead electricity purchasing decisions.

## Live Application

- **Frontend:** https://energy-analytics-git-main-saarth1.vercel.app/
- **Backend API:** https://energyanalytics-dmio.onrender.com
- **API Documentation:** https://energyanalytics-dmio.onrender.com/docs

## Problem Statement

Electricity utilities need to purchase sufficient electricity from the wholesale market to meet consumer demand. Since renewable generation, particularly wind power, depends on weather conditions, procurement teams rely on generation forecasts when making day-ahead purchasing decisions.

This project focuses on two primary requirements:

1. Provide visibility into the latest eligible wind generation forecasts available at the time of day-ahead purchasing decisions.
2. Quantitatively evaluate forecast accuracy by comparing forecasted generation against actual generation.

The scope is limited to UK national-level wind generation data obtained exclusively from Elexon for January 2026.

## Features

### Dashboard
- Summary of actual and forecast wind generation.
- Average actual and forecast generation.
- Forecast accuracy metrics.
- Forecast availability.
- Monthly generation comparison visualization.

### Generation Analysis
- Select individual delivery dates.
- Compare actual and forecast wind generation.
- View generation data across settlement intervals.
- Identify intervals where forecast data is unavailable.
- Inspect underlying generation records.

### Forecast Accuracy Analysis
- Mean Absolute Error (MAE).
- Root Mean Squared Error (RMSE).
- Mean Bias Error.
- Maximum Absolute Error.
- Forecast availability percentage.
- Daily forecast accuracy trend.
- Single-day, monthly, and custom date-range analysis.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Python, FastAPI |
| Data Processing | Pandas, NumPy |
| Data Source | Elexon BMRS API |
| Containerization | Docker |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git, GitHub |

## Data Sources

The application uses two datasets from the Elexon BMRS API.

### 1. Actual Wind Generation — FUELHH

Source: https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream

Relevant fields:

- `fuelType`: Filtered to `WIND`.
- `startTime`: Delivery interval timestamp.
- `generation`: Actual wind generation in MW.

Actual generation data is available at 30-minute intervals.

### 2. Forecast Wind Generation — WINDFOR

Source: https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream

Relevant fields:

- `startTime`: Delivery interval timestamp.
- `publishTime`: Time at which the forecast was published.
- `generation`: Forecasted wind generation in MW.

The downloaded WINDFOR dataset contains hourly forecast timestamps.

Only data relevant to purchasing decisions in January 2026 is considered. Forecast data collection also includes the preceding days where necessary to capture forecasts published before January delivery dates.

## Data Processing and Forecast Selection

A key requirement is to use the forecast that was actually available when the procurement decision was made, rather than a later revised forecast.

The processing pipeline follows these steps:

1. Retrieve actual wind generation records from FUELHH, filtering for `fuelType = WIND`.
2. Retrieve forecast records from WINDFOR, including their publication timestamps.
3. Convert timestamps into a consistent timezone-aware datetime format.
4. Associate each delivery interval with its assumed day-ahead decision cutoff.
5. Retain forecasts published on or before the decision cutoff.
6. For each delivery interval, select the forecast with the latest eligible `publishTime`.
7. Merge the selected forecasts with actual generation using `startTime`.

For this implementation, the day-ahead decision cutoff is assumed to be exactly 24 hours before the delivery interval:

`decision_cutoff = startTime - 24 hours`

This is an implementation assumption because the challenge does not specify an exact decision clock time.

### Handling Different Data Resolutions

Actual generation is available at half-hourly intervals, whereas the downloaded forecast dataset contains hourly intervals.

Consequently, not every actual generation interval has a corresponding forecast.

To handle this correctly:

- Actual records are preserved using a left join.
- Missing forecast values remain null.
- Missing forecasts are never interpreted as zero.
- Forecast values are not artificially interpolated or fabricated.
- Accuracy calculations only include intervals with both actual and forecast values.

Forecast availability is calculated as:

`Forecast Availability = (Matched Intervals / Total Actual Intervals) × 100`

This distinction is important when interpreting the accuracy metrics.

## Forecast Accuracy Metrics

The application evaluates forecast performance using the following metrics.

| Metric | Description |
|---|---|
| MAE | Average absolute difference between forecast and actual generation. |
| RMSE | Square root of the average squared forecast error. |
| Mean Bias Error | Average signed difference between forecast and actual generation. |
| Maximum Absolute Error | Largest absolute difference between forecast and actual generation. |
| Forecast Availability | Percentage of actual intervals with a corresponding forecast. |

The error is defined as:

`Error = Forecast - Actual`

Therefore:

- Positive bias indicates overforecasting.
- Negative bias indicates underforecasting.
- Lower MAE and RMSE indicate smaller forecast errors.

All error metrics are calculated only over matched actual and forecast intervals.

## Project Structure

```text
GRIDBRICKS/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── generation.py
│   │   │   ├── accuracy.py
│   │   │   └── dashboard.py
│   │   └── services/
│   │       └── data_service.py
│   │
│   ├── data/
│   │   └── wind_generation.csv
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── data/
│   ├── fuelwind_data/
│   └── windfor_data/
│
├── notebooks/
│   └── analyse.ipynb
│
├── scripts/
│   └── get_data.py
│
├── .gitignore
└── README.md
```

*The structure above describes the main project organization; individual frontend component and file names may vary.*

## Backend API Endpoints

The FastAPI backend exposes the following endpoints.

### Generation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/generation/overview` | Retrieve the complete January generation dataset. |
| GET | `/api/generation?date=2026-01-15` | Retrieve generation data for a selected date. |
| GET | `/api/generation/dates` | Retrieve available delivery dates. |

### Forecast Accuracy

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/accuracy/month` | Retrieve overall January accuracy metrics. |
| GET | `/api/accuracy?startDate=2026-01-01&endDate=2026-01-15` | Calculate accuracy for a selected date range. |
| GET | `/api/accuracy/trend?startDate=2026-01-01&endDate=2026-01-31` | Retrieve daily MAE trend data. |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Retrieve dashboard summary metrics. |

Interactive API documentation is available at:

https://energyanalytics-dmio.onrender.com/docs

## Running Locally

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

Docker is optional for local development.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd GRIDBRICKS
```

### 2. Start the Backend

Navigate to the server directory:

```bash
cd server
```

Create and activate a Python virtual environment:

```bash
python -m venv .venv
```

Windows (Git Bash):

```bash
source .venv/Scripts/activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

http://localhost:8000

API documentation:

http://localhost:8000/docs

### 3. Start the Frontend

Open another terminal and navigate to the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

http://localhost:5173

## Docker

The backend can be built and run independently using Docker.

From the project root:

### Build the image

```bash
docker build -t gridbricks-backend ./server
```

### Run the container

```bash
docker run -p 8000:8000 gridbricks-backend
```

The backend will be available at:

http://localhost:8000

The Dockerfile is located at `server/Dockerfile`.

## Deployment

The application is deployed using separate frontend and backend services.

| Component | Platform |
|---|---|
| React Frontend | Vercel |
| FastAPI Backend | Render |
| Backend Container | Docker |

The frontend communicates with the deployed backend using the `VITE_API_BASE_URL` environment variable.

The backend uses FastAPI CORS middleware to allow requests from the deployed frontend origin.

## AI Tools and Development Assistance

AI tools were used during development to assist with:

- Understanding the problem requirements and energy domain.
- Exploring the Elexon API and interpreting its datasets.
- Designing the data-processing pipeline.
- Implementing and debugging backend functionality.
- Frontend implementation and component development.
- Reviewing code, troubleshooting deployment issues, and improving documentation.

AI-assisted development was combined with manual implementation, testing, debugging, and verification.

## Scope and Limitations

- The application considers UK national-level wind generation only.
- The analysis is restricted to January 2026.
- Only Elexon FUELHH and WINDFOR datasets are used.
- The application does not incorporate electricity demand, thermal generation, market prices, or other renewable sources.
- The application provides forecast visibility and accuracy analysis; it does not calculate the utility's final electricity procurement requirement.
- Forecast and actual generation have different time resolutions in the downloaded datasets, which affects forecast availability and the intervals included in accuracy calculations.
- The day-ahead decision cutoff is assumed to be 24 hours before delivery.

## License

This project was developed as part of the GridBricks Full Stack Software Engineering Hiring Challenge.