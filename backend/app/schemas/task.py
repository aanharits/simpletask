from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.task import TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(max_length=120)
    description: str = Field(default="", max_length=2000)
    status: TaskStatus = Field(default=TaskStatus.TODO)

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Title must not be empty.")
        if len(stripped) > 120:
            raise ValueError("Title must not exceed 120 characters.")
        return stripped

    @field_validator("description")
    @classmethod
    def strip_description(cls, value: str) -> str:
        stripped = value.strip()
        if len(stripped) > 2000:
            raise ValueError("Description must not exceed 2000 characters.")
        return stripped


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=120)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[TaskStatus] = Field(default=None)

    @model_validator(mode="after")
    def validate_fields(self) -> "TaskUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided.")
        for field_name in ("title", "description", "status"):
            if field_name in self.model_fields_set and getattr(self, field_name) is None:
                raise ValueError(f"{field_name.capitalize()} cannot be null.")
        return self

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError("Title must not be empty.")
        if len(stripped) > 120:
            raise ValueError("Title must not exceed 120 characters.")
        return stripped

    @field_validator("description")
    @classmethod
    def strip_description(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        stripped = value.strip()
        if len(stripped) > 2000:
            raise ValueError("Description must not exceed 2000 characters.")
        return stripped


class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    status: str

    model_config = {"from_attributes": True}
