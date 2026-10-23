"""Integration tests for the backend configuration and data layer."""

import pytest
from pydantic_core import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from app.db.session import get_session
from app.models.task import Task, TaskStatus


def test_settings_fails_without_database_url(monkeypatch):
    """Verify that settings fails with a clear validation error if DATABASE_URL is missing."""
    monkeypatch.delenv("DATABASE_URL", raising=False)

    class DummySettings(BaseSettings):
        model_config = SettingsConfigDict(env_file=(), extra="ignore")
        database_url: str

    with pytest.raises(ValidationError) as exc_info:
        DummySettings()
    assert "database_url" in str(exc_info.value)


def test_get_session_dependency():
    """Verify get_session yields a valid session and closes it."""
    session_gen = get_session()
    session = next(session_gen)
    assert isinstance(session, Session)
    # verify session is active
    assert session.is_active
    with pytest.raises(StopIteration):
        next(session_gen)


def test_task_table_crud_in_postgres(db_session: Session):
    """Verify that the Task table exists and persists records in PostgreSQL."""
    # Create a test task
    task = Task(
        title="Data Layer Test Task",
        description="Testing DB persistence",
        status=TaskStatus.TODO.value,
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    assert task.id is not None

    # Read back
    fetched = db_session.get(Task, task.id)
    assert fetched is not None
    assert fetched.title == "Data Layer Test Task"
    assert fetched.status == "Todo"

    # Cleanup
    db_session.delete(fetched)
    db_session.commit()

    # Confirm deleted
    assert db_session.get(Task, task.id) is None


def test_task_check_constraint_rejects_empty_title(db_session: Session):
    """Verify database check constraint prevents empty/whitespace title in PostgreSQL."""
    task = Task(title="   ", description="empty title test", status=TaskStatus.TODO.value)
    db_session.add(task)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_task_check_constraint_rejects_invalid_status(db_session: Session):
    """Verify database check constraint prevents invalid status in PostgreSQL."""
    task = Task(title="Invalid Status Task", description="", status="Unknown")
    db_session.add(task)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()
