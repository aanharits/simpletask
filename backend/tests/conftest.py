from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select

from app.core.config import settings
from app.db.session import get_session
from app.main import app
from app.models.task import Task

test_engine = create_engine(settings.database_url, echo=False)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    SQLModel.metadata.create_all(test_engine)
    yield


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    with Session(test_engine) as session:
        yield session


# Bersihkan tabel task sebelum dan sesudah test agar setiap test terisolasi.
@pytest.fixture(autouse=True)
def clean_tasks(db_session: Session):
    existing = db_session.exec(select(Task)).all()
    for item in existing:
        db_session.delete(item)
    db_session.commit()

    yield

    existing = db_session.exec(select(Task)).all()
    for item in existing:
        db_session.delete(item)
    db_session.commit()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_session() -> Generator[Session, None, None]:
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
