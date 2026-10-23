"""Task database table model and status enum."""

import enum
from typing import Optional

from sqlmodel import CheckConstraint, Field, SQLModel


class TaskStatus(str, enum.Enum):
    """Allowed task statuses — values match the brief exactly."""

    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


class Task(SQLModel, table=True):
    """Represents a task row in PostgreSQL.

    This model owns the database schema; request/response validation
    lives in app.schemas.task.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=120, nullable=False)
    description: str = Field(default="", max_length=2000, nullable=False)
    status: str = Field(default=TaskStatus.TODO.value, nullable=False)

    __table_args__ = (
        # Database-level guard: title must not be an empty string.
        CheckConstraint("length(trim(title)) > 0", name="ck_task_title_not_empty"),
        # Database-level guard: status must be one of the three allowed values.
        CheckConstraint(
            "status IN ('Todo', 'In Progress', 'Done')",
            name="ck_task_status_valid",
        ),
    )
