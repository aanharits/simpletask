from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.tasks import router as tasks_router
from app.core.config import settings
from app.db.session import create_db_and_tables

# Impor model ini sebelum create_all agar tabelnya terdaftar di metadata.
from app.models.task import Task  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Task Tracker API", version="0.1.0", lifespan=lifespan)

# CORS — use the configured origin instead of a hardcoded value.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(tasks_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
