from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from .database import connect_to_mongo, close_mongo_connection
from .api import auth, users, projects, teams, forums, events, messages, notifications
from .config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

# Create FastAPI app
app = FastAPI(
    title="Co-OpFlow Backend API",
    description="Backend API for Co-OpFlow - A platform for connecting developers and projects",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs(settings.upload_dir, exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(teams.router, prefix="/api/v1")
app.include_router(forums.router, prefix="/api/v1")
app.include_router(events.router, prefix="/api/v1")
app.include_router(messages.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup."""
    logging.info("Starting Co-OpFlow Backend API...")
    await connect_to_mongo()
    logging.info("Connected to MongoDB successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown."""
    logging.info("Shutting down Co-OpFlow Backend API...")
    await close_mongo_connection()
    logging.info("Disconnected from MongoDB")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Co-OpFlow Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "API is running"}


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logging.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return HTTPException(
        status_code=500,
        detail=f"Internal server error: {str(exc)}"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    ) 