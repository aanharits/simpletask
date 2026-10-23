from typing import Optional

from sqlmodel import Session, select

from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks(session: Session) -> list[Task]:
    statement = select(Task).order_by(Task.id.asc())  # type: ignore
    return list(session.exec(statement).all())


def get_task_by_id(session: Session, task_id: int) -> Optional[Task]:
    return session.get(Task, task_id)


def create_task(session: Session, task_in: TaskCreate) -> Task:
    status_value = (
        task_in.status.value if isinstance(task_in.status, TaskStatus) else str(task_in.status)
    )
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=status_value,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def update_task(session: Session, task: Task, task_in: TaskUpdate) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)

    if "status" in update_data and update_data["status"] is not None:
        status_field = task_in.status
        update_data["status"] = (
            status_field.value if isinstance(status_field, TaskStatus) else str(status_field)
        )

    for field, value in update_data.items():
        setattr(task, field, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def delete_task(session: Session, task: Task) -> None:
    session.delete(task)
    session.commit()
