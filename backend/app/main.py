"""
StadiumPilot AI — FastAPI Application Entry Point.

Enterprise-grade AI platform for FIFA World Cup 2026
stadium operations and fan experience.
"""

import typing

from app.api.accessibility import router as accessibility_router
from app.api.assistant import router as assistant_router
from app.api.navigation import router as navigation_router
from app.api.operations import router as operations_router
from app.api.transport import router as transport_router
from app.core.config import settings
from app.schemas.response import ErrorResponse, HealthResponse
from app.utils.helpers import get_crowd_data, get_stadium_data
from app.utils.logger import logger
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled Exception: %s", str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error. Please try again later.",
            "error_code": "INTERNAL_ERROR",
        },
    )


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(
    request: Request, call_next: typing.Callable[[Request], typing.Awaitable[Response]]
) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# GZip middleware for payload compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS middleware — restricted to safe methods and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=getattr(settings, "CORS_ORIGIN_REGEX", None),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Register routers
app.include_router(assistant_router)
app.include_router(navigation_router)
app.include_router(operations_router)
app.include_router(transport_router)
app.include_router(accessibility_router)


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check(response: Response) -> HealthResponse:
    """Health check endpoint."""
    response.headers["Cache-Control"] = "public, max-age=60"
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        service=settings.APP_NAME,
    )


@app.get(
    "/api/stadium",
    tags=["Stadium Data"],
    responses={500: {"model": ErrorResponse}},
    summary="Get stadium data",
    description="Return the full stadium dataset including gates, food courts, restrooms, and facilities.",
)
async def get_stadium(response: Response) -> dict[str, typing.Any]:
    """Return the full stadium dataset."""
    try:
        response.headers["Cache-Control"] = "public, max-age=300"
        data = get_stadium_data()
        return data
    except FileNotFoundError:
        logger.error("Stadium data file not found")
        raise HTTPException(
            status_code=500, detail="Stadium data is currently unavailable."
        )
    except Exception as exc:
        logger.error("Stadium data error: %s", str(exc))
        raise HTTPException(status_code=500, detail="Failed to load stadium data.")


@app.get(
    "/api/crowd",
    tags=["Crowd Intelligence"],
    responses={500: {"model": ErrorResponse}},
    summary="Get crowd data",
    description="Return the current crowd intelligence data including zone occupancy and risk levels.",
)
async def get_crowd(response: Response) -> dict[str, typing.Any]:
    """Return the current crowd intelligence data."""
    try:
        response.headers["Cache-Control"] = "public, max-age=10"
        data = get_crowd_data()
        return data
    except FileNotFoundError:
        logger.error("Crowd data file not found")
        raise HTTPException(
            status_code=500, detail="Crowd data is currently unavailable."
        )
    except Exception as exc:
        logger.error("Crowd data error: %s", str(exc))
        raise HTTPException(status_code=500, detail="Failed to load crowd data.")


logger.info("%s v%s - ready to serve!", settings.APP_NAME, settings.APP_VERSION)
