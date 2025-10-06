import anthropic
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def summarize_article(title: str, content: str) -> str:
    """Generate a concise summary using Claude."""
    try:
        prompt = f"""Please provide a concise 2-3 sentence summary of this tech news article:

Title: {title}

Content: {content}

Focus on the key technical points and significance. Keep it brief and informative."""

        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
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
