import uuid
from datetime import datetime, timedelta
from argon2 import PasswordHasher
from jose import jwt, JWTError

# Password hashing with Argon2
pwd_hasher = PasswordHasher()

def hash_password(pw: str) -> str:
    """Hash a plain password using Argon2."""
    return pwd_hasher.hash(pw)

def verify_password(pw: str, hashed: str) -> bool:
    """Verify a password against its Argon2 hash."""
    try:
        return pwd_hasher.verify(hashed, pw)
    except Exception:
        return False

# JWT configuration
SECRET_KEY = "<GENERATE_RANDOM_32_BYTE_KEY>"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# In‑memory blacklist of revoked JWT IDs (jti)
revoked_jti: set[str] = set()

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT with a unique ``jti`` claim.
    The ``sub`` claim must contain the user identifier (email).
    """
    to_encode = data.copy()
    jti = str(uuid.uuid4())
    to_encode.update({"jti": jti})
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def is_token_revoked(jti: str) -> bool:
    return jti in revoked_jti

def revoke_token(jti: str) -> None:
    revoked_jti.add(jti)
