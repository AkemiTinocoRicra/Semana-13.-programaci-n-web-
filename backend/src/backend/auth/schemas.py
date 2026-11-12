from pydantic import BaseModel, EmailStr

class UserInDB(BaseModel):
    id: int
    email: EmailStr
    hashed_password: str
