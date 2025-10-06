import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001/api'

const ArticleCard = ({ article, onRefresh }) => {
  const [summarizing, setSummarizing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleSummarize = async () => {
    setSummarizing(true)
    try {
      await axios.post(`${API_BASE_URL}/articles/${article.id}/summarize`)
      onRefresh()
    } catch (error) {
      console.error('Error summarizing:', error)
      alert('Error generating summary')
    } finally {
      setSummarizing(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              {article.title}
            </a>
          </h2>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              {article.source}
            </span>
            {article.published_date && (
              <span>{formatDate(article.published_date)}</span>
            )}
          </div>
        </div>
      </div>

      {article.summary ? (
        <div className="mb-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm font-medium text-blue-800 mb-2">AI Summary</p>
            <p className="text-gray-700">{article.summary}</p>
          </div>
        </div>
      ) : article.content && (
        <button
          onClick={handleSummarize}
          disabled={summarizing}
          className="mb-4 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {summarizing ? 'Generating Summary...' : 'Generate AI Summary'}
        </button>
      )}

      {article.content && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm font-medium hover:underline mb-2"
          >
            {expanded ? 'Hide Content' : 'Show Content'}
          </button>
          {expanded && (
            <div className="text-gray-600 text-sm border-t pt-3 mt-2">
              <p className="line-clamp-6">{article.content}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center"
        >
          Read Full Article →
        </a>
      </div>
    </article>
  )
}

export default ArticleCard
