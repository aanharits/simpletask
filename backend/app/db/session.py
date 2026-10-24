from collections.abc import Generator
from sqlmodel import Session, SQLModel, create_engine
from app.core.config import settings

engine = create_engine(settings.database_url, echo=False)

# Dependency FastAPI untuk menyediakan session database per request dan menutupnya setelah selesai.
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

# Membuat tabel PostgreSQL yang terdaftar di metadata jika belum ada saat startup.
def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
