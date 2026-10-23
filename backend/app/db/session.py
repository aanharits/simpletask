"""Database engine, per-request session dependency, and table initialization."""

from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(settings.database_url, echo=False)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a session and closes it after the request."""
    with Session(engine) as session:
        yield session


def create_db_and_tables() -> None:
    """Create all registered SQLModel tables if they don't already exist.

    All table models must be imported before this function is called so that
    SQLModel.metadata contains the correct table definitions.
    """
    SQLModel.metadata.create_all(engine)
