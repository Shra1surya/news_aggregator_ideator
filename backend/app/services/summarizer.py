import anthropic
from app.core.config import settings
import logging
import httpx
import os

logger = logging.getLogger(__name__)

# Create httpx client with proxy support
proxies = None
if os.getenv('http_proxy') or os.getenv('https_proxy'):
    http_proxy = os.getenv('http_proxy') or os.getenv('HTTP_PROXY')
    https_proxy = os.getenv('https_proxy') or os.getenv('HTTPS_PROXY')
    proxies = {
        "http://": http_proxy,
        "https://": https_proxy,
    }
    logger.info(f"Using proxy for Anthropic API: {https_proxy}")

# Create Anthropic client with proxy-aware httpx client
http_client = httpx.Client(proxies=proxies, timeout=60.0) if proxies else None
client = anthropic.Anthropic(
    api_key=settings.ANTHROPIC_API_KEY,
    http_client=http_client
)


def summarize_article(title: str, content: str) -> str:
    """Generate a concise summary using Claude."""
    try:
        prompt = f"""Please provide a concise 2-3 sentence summary of this tech news article:

Title: {title}

Content: {content}

Focus on the key technical points and significance. Keep it brief and informative."""

        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        summary = message.content[0].text
        logger.info(f"Generated summary for: {title[:50]}...")
        return summary

    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        return "Summary unavailable."
