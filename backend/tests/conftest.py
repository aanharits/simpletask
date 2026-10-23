"""Pytest configuration and shared fixtures for backend testing.

Provides client fixtures, database session dependency overrides,
and clean database state before each test run.
"""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select

from app.core.config import settings
from app.db.session import get_session
from app.main import app
from app.models.task import Task

# Use DATABASE_URL from settings
test_engine = create_engine(settings.database_url, echo=False)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Ensure tables exist before tests begin."""
    SQLModel.metadata.create_all(test_engine)
    yield


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Provide a dedicated test session that rolls back or closes cleanly."""
    with Session(test_engine) as session:
        yield session


@pytest.fixture(autouse=True)
def clean_tasks(db_session: Session):
    """Ensure a clean tasks table before and after each test for isolation."""
    # Pre-clean
    existing = db_session.exec(select(Task)).all()
    for item in existing:
        db_session.delete(item)
    db_session.commit()

    yield

    # Post-clean
    existing = db_session.exec(select(Task)).all()
    for item in existing:
        db_session.delete(item)
    db_session.commit()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """FastAPI TestClient with the database session dependency overridden to use test session."""

    def override_get_session() -> Generator[Session, None, None]:
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
