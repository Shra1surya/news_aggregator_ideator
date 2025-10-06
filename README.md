# Tech News Aggregator MVP

A minimal viable product for aggregating tech news from multiple RSS feeds with AI-powered summarization.

## Features (MVP)

- ✅ Fetch news from 5 major tech sources (TechCrunch, Hacker News, Ars Technica, The Verge, Wired)
- ✅ Store articles in PostgreSQL database
- ✅ AI-powered article summarization using Claude API
- ✅ REST API with FastAPI
- ✅ React frontend with Tailwind CSS
- ✅ Source filtering
- ✅ Automatic background summarization

## Tech Stack

**Backend:**
- Python 3.11
- FastAPI
- SQLAlchemy + PostgreSQL
- Anthropic Claude API
- feedparser (RSS)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios

**Infrastructure:**
- Docker & Docker Compose
- Redis (for future Celery tasks)

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd /home/ssuryana/projects/claude/news_aggr_ideate_poc
   ```

2. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

3. **Start the backend services with Docker:**
   ```bash
   docker-compose up -d postgres redis backend
   ```

4. **Install and run the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Usage

1. Click **"Fetch News"** button to pull latest articles from RSS feeds
2. Articles will appear in the feed with source badges
3. Click **"Generate AI Summary"** on any article to get an AI-powered summary
4. Filter by source using the source buttons in the header
5. Click article titles or "Read Full Article" to view original content

## API Endpoints

- `POST /api/articles/fetch` - Fetch new articles from RSS feeds
- `GET /api/articles` - Get articles (supports `?source=` filter)
- `GET /api/articles/{id}` - Get single article
- `POST /api/articles/{id}/summarize` - Generate summary for article
- `GET /api/sources` - Get list of available sources

## Development

### Running without Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start PostgreSQL and Redis separately
# Update DATABASE_URL and REDIS_URL in .env

uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Next Steps (Post-MVP)

- [ ] User authentication & profiles
- [ ] Personalized feeds based on user preferences
- [ ] Vector database for semantic search
- [ ] Sentiment analysis & trend detection
- [ ] Idea capture interface
- [ ] Co-ideator AI agent for brainstorming
- [ ] Newsletter generation
- [ ] Social media integration
- [ ] Scheduled background tasks with Celery

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Config & settings
│   │   ├── db/            # Database setup
│   │   ├── models/        # SQLAlchemy models
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── docker-compose.yml
```

## License

MIT
