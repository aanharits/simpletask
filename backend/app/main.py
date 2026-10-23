"""FastAPI application entry point.

Creates the app instance, configures CORS from settings, runs
automatic table initialization at startup via lifespan, and registers
the task routes.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.tasks import router as tasks_router
from app.core.config import settings
from app.db.session import create_db_and_tables

# Import the table model so SQLModel.metadata registers it before create_all().
from app.models.task import Task  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create database tables if they don't exist yet."""
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
    """Lightweight probe to verify the backend process is running."""
    return {"status": "ok"}
