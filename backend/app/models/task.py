import enum
from typing import Optional

from sqlmodel import CheckConstraint, Field, SQLModel


# Enum status task sesuai spesifikasi contract ('Todo', 'In Progress', 'Done').
class TaskStatus(str, enum.Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


# Model tabel task di PostgreSQL yang mendefinisikan schema dan batasan data.
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=120, nullable=False)
    description: str = Field(default="", max_length=2000, nullable=False)
    status: str = Field(default=TaskStatus.TODO.value, nullable=False)

    __table_args__ = (
        # Batasan integritas data langsung di level database PostgreSQL.
        CheckConstraint("length(trim(title)) > 0", name="ck_task_title_not_empty"),
        CheckConstraint(
            "status IN ('Todo', 'In Progress', 'Done')",
            name="ck_task_status_valid",
        ),
    )
