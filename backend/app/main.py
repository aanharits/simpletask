from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.tasks import router as tasks_router
from app.core.config import settings
from app.db.session import create_db_and_tables

# Mengimpor model ini sebelum create_all agar tabelnya terdaftar di metadata.
from app.models.task import Task  # noqa: F401


# Menjalankan inisialisasi tabel database saat aplikasi FastAPI mulai berjalan.
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Task Tracker API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)


# Endpoint health check untuk memverifikasi service backend berjalan dengan baik.
@app.get("/health")
def health_check():
    return {"status": "ok"}
