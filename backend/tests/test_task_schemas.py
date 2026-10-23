"""Unit tests for Task API schemas and validators."""

import pytest
from pydantic import ValidationError

from app.models.task import TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate


class TestTaskCreate:
    def test_valid_task_create_minimal(self):
        task_in = TaskCreate(title="Complete Phase 2")
        assert task_in.title == "Complete Phase 2"
        assert task_in.description == ""
        assert task_in.status == TaskStatus.TODO

    def test_valid_task_create_full(self):
        task_in = TaskCreate(
            title="Complete Phase 2",
            description="All requirements fulfilled",
            status=TaskStatus.IN_PROGRESS,
        )
        assert task_in.title == "Complete Phase 2"
        assert task_in.description == "All requirements fulfilled"
        assert task_in.status == TaskStatus.IN_PROGRESS

    def test_title_is_trimmed(self):
        task_in = TaskCreate(title="  Spaced Title   ")
        assert task_in.title == "Spaced Title"

    def test_whitespace_title_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            TaskCreate(title="   ")
        errors = exc_info.value.errors()
        assert any("Title must not be empty" in str(e["msg"]) for e in errors)

    def test_empty_title_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            TaskCreate(title="")
        errors = exc_info.value.errors()
        assert any("Title must not be empty" in str(e["msg"]) for e in errors)

    def test_title_too_long_rejected(self):
        with pytest.raises(ValidationError):
            TaskCreate(title="a" * 121)

    def test_description_too_long_rejected(self):
        with pytest.raises(ValidationError):
            TaskCreate(title="Valid Title", description="a" * 2001)

    def test_invalid_status_rejected(self):
        with pytest.raises(ValidationError):
            TaskCreate(title="Valid Title", status="NonExistentStatus")


class TestTaskUpdate:
    def test_update_single_field_title(self):
        update = TaskUpdate(title="Updated Title")
        assert update.title == "Updated Title"
        assert update.description is None
        assert update.status is None

    def test_update_single_field_status(self):
        update = TaskUpdate(status=TaskStatus.DONE)
        assert update.status == TaskStatus.DONE
        assert update.title is None
        assert update.description is None

    def test_update_single_field_description(self):
        update = TaskUpdate(description="Updated notes")
        assert update.description == "Updated notes"
        assert update.title is None
        assert update.status is None

    def test_empty_update_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            TaskUpdate()
        errors = exc_info.value.errors()
        assert any("At least one field must be provided" in str(e["msg"]) for e in errors)

    def test_explicit_null_title_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            TaskUpdate(title=None)
        errors = exc_info.value.errors()
        assert any(
            "cannot be null" in str(e["msg"]).lower()
            or "at least one field" in str(e["msg"]).lower()
            for e in errors
        )

    def test_explicit_null_with_other_field_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            TaskUpdate(title=None, status=TaskStatus.DONE)
        errors = exc_info.value.errors()
        assert any("Title cannot be null" in str(e["msg"]) for e in errors)

    def test_whitespace_title_update_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            TaskUpdate(title="   ")
        errors = exc_info.value.errors()
        assert any("Title must not be empty" in str(e["msg"]) for e in errors)

    def test_invalid_status_update_rejected(self):
        with pytest.raises(ValidationError):
            TaskUpdate(status="InvalidStatus")


class TestTaskRead:
    def test_valid_task_read(self):
        data = {
            "id": 1,
            "title": "Sample Task",
            "description": "Sample description",
            "status": "Todo",
        }
        task_read = TaskRead.model_validate(data)
        assert task_read.id == 1
        assert task_read.title == "Sample Task"
        assert task_read.status == "Todo"
