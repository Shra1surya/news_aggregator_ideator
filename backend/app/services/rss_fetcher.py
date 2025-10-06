import feedparser
from datetime import datetime
from typing import List, Dict
import logging
import os

logger = logging.getLogger(__name__)

# Set proxy for feedparser if environment variables exist
if os.getenv('http_proxy') or os.getenv('HTTP_PROXY'):
    http_proxy = os.getenv('http_proxy') or os.getenv('HTTP_PROXY')
    https_proxy = os.getenv('https_proxy') or os.getenv('HTTPS_PROXY')
    logger.info(f"Using proxy: {http_proxy}")
else:
    logger.info("No proxy configured")

# MVP RSS feeds
RSS_FEEDS = {
    "TechCrunch": "https://techcrunch.com/feed/",
    "Hacker News": "https://hnrss.org/frontpage",
    "Ars Technica": "https://feeds.arstechnica.com/arstechnica/index",
    "The Verge": "https://www.theverge.com/rss/index.xml",
    "Wired": "https://www.wired.com/feed/rss"
}


def parse_date(date_string: str) -> datetime:
    """Parse various date formats from RSS feeds."""
    try:
        return datetime(*feedparser._parse_date(date_string)[:6])
    except:
        return datetime.now()


def fetch_feed(source_name: str, feed_url: str) -> List[Dict]:
    """Fetch articles from a single RSS feed."""
    articles = []
    try:
        # feedparser respects http_proxy and https_proxy environment variables automatically
        feed = feedparser.parse(feed_url)

        if feed.bozo:
            logger.warning(f"Feed parsing warning for {source_name}: {feed.bozo_exception}")

        for entry in feed.entries[:20]:  # Limit to 20 most recent
            article = {
                "title": entry.get("title", ""),
                "url": entry.get("link", ""),
                "source": source_name,
                "published_date": parse_date(entry.get("published", "")),
                "content": entry.get("summary", entry.get("description", ""))[:5000]  # Limit content
            }
            articles.append(article)

        logger.info(f"Fetched {len(articles)} articles from {source_name}")
    except Exception as e:
        logger.error(f"Error fetching {source_name}: {str(e)}")

    return articles


def fetch_all_feeds() -> List[Dict]:
    """Fetch articles from all configured RSS feeds."""
    all_articles = []

    for source_name, feed_url in RSS_FEEDS.items():
        articles = fetch_feed(source_name, feed_url)
        all_articles.extend(articles)

    logger.info(f"Total articles fetched: {len(all_articles)}")
    return all_articles
