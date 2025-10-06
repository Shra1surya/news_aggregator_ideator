# Setup & Running the Application

## Current Status
✅ Backend is running on **http://localhost:8001**
✅ Frontend is running on **http://localhost:3000**
✅ Successfully fetched 90 articles from RSS feeds!

## Important: Proxy Configuration

Since you're behind a corporate proxy, you need to:

### 1. Backend (Already Configured)
The backend `.env` file already has proxy settings:
```
http_proxy="http://proxy-dmz.intel.com:911"
https_proxy="http://proxy-dmz.intel.com:912"
```

### 2. Frontend - Browser Configuration
The frontend runs in your browser, so you need to ensure your **browser** can access `localhost:8001`.

**Option A: Set NO_PROXY in your environment** (Recommended)
```bash
export no_proxy=localhost,127.0.0.1,.local
export NO_PROXY=localhost,127.0.0.1,.local
```

**Option B: Configure browser proxy settings**
- Add `localhost` and `127.0.0.1` to proxy bypass list
- In Chrome/Firefox: Settings → Network → Proxy → Bypass proxy for these hosts

## Running the Application

### Start Backend (Already Running)
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Start Frontend (Should Already be Running on port 3000)
```bash
cd frontend
npm run dev
```

## Testing the Application

### 1. Open Frontend
Go to: **http://localhost:3000**

### 2. Click "Fetch News"
This will fetch latest articles from:
- TechCrunch
- Hacker News
- Ars Technica
- The Verge
- Wired

### 3. Generate AI Summaries
Click "Generate AI Summary" on any article to get a Claude-powered summary.

## Troubleshooting

### "Error fetching articles" in frontend

**Problem**: Browser cannot reach `localhost:8001` due to proxy

**Solution**:
1. Add to your shell profile (`~/.bashrc` or `~/.zshrc`):
   ```bash
   export no_proxy=localhost,127.0.0.1,.local
   export NO_PROXY=localhost,127.0.0.1,.local
   ```

2. Reload your shell:
   ```bash
   source ~/.bashrc  # or source ~/.zshrc
   ```

3. Restart your browser

**Alternative**: Use `curl` to test backend directly:
```bash
export no_proxy=localhost,127.0.0.1
curl http://localhost:8001/health
curl http://localhost:8001/api/articles?limit=5
```

### Summary generation fails

Check that your Anthropic API key is set correctly in `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Current Database

Using SQLite: `backend/newsaggr.db`

To view data:
```bash
cd backend
sqlite3 newsaggr.db
.tables
SELECT COUNT(*) FROM articles;
.quit
```

## Next Steps (Future Development)

Once the MVP is working:
1. User authentication
2. Personalized feeds
3. Vector database for semantic search
4. Idea capture interface
5. Co-ideator AI agent

## Quick Commands

```bash
# Check backend logs
tail -f backend/logs/*.log  # if logging to file

# Restart backend
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

# Test fetch endpoint
export no_proxy=localhost,127.0.0.1
curl -X POST http://localhost:8001/api/articles/fetch

# Get articles
curl http://localhost:8001/api/articles?limit=10
```
