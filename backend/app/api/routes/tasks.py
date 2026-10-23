from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead], status_code=status.HTTP_200_OK)
def list_tasks(session: Session = Depends(get_session)) -> list[TaskRead]:
    tasks = task_service.get_tasks(session)
    return [TaskRead.model_validate(task) for task in tasks]


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, session: Session = Depends(get_session)) -> TaskRead:
    task = task_service.create_task(session, task_in)
    return TaskRead.model_validate(task)


@router.put("/{task_id}", response_model=TaskRead, status_code=status.HTTP_200_OK)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    session: Session = Depends(get_session),
) -> TaskRead:
    task = task_service.get_task_by_id(session, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )

    updated_task = task_service.update_task(session, task, task_in)
    return TaskRead.model_validate(updated_task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, session: Session = Depends(get_session)) -> Response:
    task = task_service.get_task_by_id(session, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )

    task_service.delete_task(session, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
