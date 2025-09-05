from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Annotated
from datetime import datetime
from bson import ObjectId

# Pydantic v2 compatible ObjectId handling
PyObjectId = Annotated[str, Field(alias="_id")]

class TaskBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=500)
    completed: Optional[bool] = None

class Task(TaskBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()))
    user_email: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class TaskResponse(BaseModel):
    id: str
    text: str
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
