from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from backend.apis.personas import router as personas_router
from backend.auth.router import router as auth_router
from backend.services.exceptions import (
    PersonaAlreadyExistsError,
    PersonaNotFoundError,
)

app = FastAPI(
    title="Personas API",
    version="0.1.0",
    description="CRUD de personas con almacenamiento en memoria.",
)

app.include_router(personas_router)


@app.exception_handler(PersonaNotFoundError)
async def persona_not_found_handler(
    request: Request, exc: PersonaNotFoundError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)},
    )


@app.exception_handler(PersonaAlreadyExistsError)
async def persona_already_exists_handler(
    request: Request, exc: PersonaAlreadyExistsError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": str(exc)},
    )
