from typing import Optional
from ..schemas.user import UserInDB

class UserRepository:
    def __init__(self):
        self._id_counter = 1
        self._users: dict[str, UserInDB] = {}

    async def create(self, email: str, hashed_password: str) -> UserInDB:
        user = UserInDB(id=self._id_counter, email=email, hashed_password=hashed_password)
        self._users[email] = user
        self._id_counter += 1
        return user

    async def get_by_email(self, email: str) -> Optional[UserInDB]:
        return self._users.get(email)
