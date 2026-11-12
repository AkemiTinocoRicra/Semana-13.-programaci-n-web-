from fastapi import APIRouter, HTTPException, status, Response, Request, Depends
from ..auth.models import UserCreate, TokenResponse
from ..auth.utils import hash_password, verify_password, create_access_token, revoke_token, is_token_revoked
from ..services.user_service import create_user, get_user_by_email
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
async def register(user: UserCreate, response: Response):
    existing = await get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    hashed = hash_password(user.password)
    db_user = await create_user(email=user.email, hashed_password=hashed)
    access_token = create_access_token({"sub": db_user.email})
    # Set HttpOnly cookie (30 min expiry)
    response.set_cookie(key="access_token", value=access_token, httponly=True, max_age=60*30, secure=False)
    return TokenResponse(access_token=access_token)

@router.post("/login", response_model=TokenResponse)
async def login(user: UserCreate, response: Response):
    db_user = await get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    access_token = create_access_token({"sub": db_user.email})
    response.set_cookie(key="access_token", value=access_token, httponly=True, max_age=60*30, secure=False)
    return TokenResponse(access_token=access_token)

@router.post("/logout")
async def logout(request: Request, response: Response, current_user=Depends(get_current_user)):
    # Retrieve token from cookie
    token = request.cookies.get("access_token")
    if token:
        from jose import JWTError, jwt
        try:
            payload = jwt.decode(token, current_user["SECRET_KEY"] if isinstance(current_user, dict) else "", algorithms=["HS256"])
            jti = payload.get("jti")
            if jti:
                revoke_token(jti)
        except JWTError:
            pass
    # Delete cookie
    response.delete_cookie(key="access_token")
    return {"msg": "Logged out"}

@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return {"email": current_user.email, "id": current_user.id}
