from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import articles
from app.db.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tech News Aggregator API", version="0.1.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(articles.router, prefix="/api", tags=["articles"])


@app.get("/")
async def root():
    return {"message": "Tech News Aggregator API", "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
