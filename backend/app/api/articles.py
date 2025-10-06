from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.db.database import get_db
from app.models.article import Article
from app.services.rss_fetcher import fetch_all_feeds
from app.services.summarizer import summarize_article

router = APIRouter()


class ArticleResponse(BaseModel):
    id: int
    title: str
    url: str
    source: str
    published_date: datetime | None
    content: str | None
    summary: str | None
    is_summarized: bool
    created_at: datetime

    class Config:
        from_attributes = True


def summarize_articles_background(db: Session):
    """Background task to summarize articles."""
    unsummarized = db.query(Article).filter(Article.is_summarized == False).limit(10).all()

    for article in unsummarized:
        if article.content:
            article.summary = summarize_article(article.title, article.content)
            article.is_summarized = True
            db.commit()


@router.post("/articles/fetch")
async def fetch_articles(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Fetch latest articles from RSS feeds."""
    articles_data = fetch_all_feeds()

    new_count = 0
    for article_data in articles_data:
        # Check if article already exists
        existing = db.query(Article).filter(Article.url == article_data["url"]).first()
        if not existing:
            article = Article(**article_data)
            db.add(article)
            new_count += 1

    db.commit()

    # Trigger summarization in background
    background_tasks.add_task(summarize_articles_background, db)

    return {"message": f"Fetched {len(articles_data)} articles, {new_count} new"}


@router.get("/articles", response_model=List[ArticleResponse])
async def get_articles(
    skip: int = 0,
    limit: int = 20,
    source: str | None = None,
    db: Session = Depends(get_db)
):
    """Get articles with optional filtering (excludes archived)."""
    query = db.query(Article).filter(Article.is_archived == False).order_by(Article.published_date.desc())

    if source:
        query = query.filter(Article.source == source)

    articles = query.offset(skip).limit(limit).all()
    return articles


@router.get("/articles/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a single article by ID."""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/articles/{article_id}/summarize")
async def summarize_article_endpoint(article_id: int, db: Session = Depends(get_db)):
    """Manually trigger summarization for a specific article."""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    if not article.content:
        raise HTTPException(status_code=400, detail="Article has no content to summarize")

    article.summary = summarize_article(article.title, article.content)
    article.is_summarized = True
    db.commit()

    return {"message": "Article summarized successfully", "summary": article.summary}


@router.get("/sources")
async def get_sources(db: Session = Depends(get_db)):
    """Get list of available news sources."""
    sources = db.query(Article.source).distinct().all()
    return {"sources": [s[0] for s in sources]}


@router.post("/articles/archive-all")
async def archive_all_articles(db: Session = Depends(get_db)):
    """Archive all current articles."""
    from datetime import datetime

    articles = db.query(Article).filter(Article.is_archived == False).all()
    count = len(articles)

    for article in articles:
        article.is_archived = True
        article.archived_at = datetime.now()

    db.commit()
    return {"message": f"Archived {count} articles"}


@router.delete("/articles/delete-all")
async def delete_all_articles(db: Session = Depends(get_db)):
    """Delete all articles (both active and archived)."""
    count = db.query(Article).count()
    db.query(Article).delete()
    db.commit()
    return {"message": f"Deleted {count} articles"}


@router.post("/articles/cleanup")
async def cleanup_old_archives(db: Session = Depends(get_db)):
    """Delete archived articles older than 3 days."""
    from datetime import datetime, timedelta

    three_days_ago = datetime.now() - timedelta(days=3)

    old_articles = db.query(Article).filter(
        Article.is_archived == True,
        Article.archived_at < three_days_ago
    ).all()

    count = len(old_articles)

    for article in old_articles:
        db.delete(article)

    db.commit()
    return {"message": f"Deleted {count} archived articles older than 3 days"}
