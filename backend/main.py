from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import analyze

app = FastAPI(title="WesternHaze API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)


@app.get("/healthcheck")
def healthcheck():
    return {"status": "OK"}
