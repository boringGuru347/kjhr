from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generation
from app.routes import accuracy
from app.routes import dashboard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://energy-analytics-sooty.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Running"}


app.include_router(generation.router, prefix="/api/generation", tags=["Generation"])
app.include_router(accuracy.router, prefix="/api/accuracy", tags=["Accuracy"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
