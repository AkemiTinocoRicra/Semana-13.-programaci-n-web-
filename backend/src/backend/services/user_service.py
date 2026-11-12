from typing import Optional
from .repositories.user_repository import UserRepository
from ..auth.schemas import UserInDB

repo = UserRepository()

async def create_user(email: str, hashed_password: str) -> UserInDB:
    return await repo.create(email=email, hashed_password=hashed_password)

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    return await repo.get_by_email(email)
