import { useState, useEffect } from 'react'
import axios from 'axios'
import ArticleList from './components/ArticleList'
import Header from './components/Header'

const API_BASE_URL = 'http://localhost:8001/api'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [selectedSource, setSelectedSource] = useState(null)
  const [sources, setSources] = useState([])

  useEffect(() => {
    loadArticles()
    loadSources()
  }, [selectedSource])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const params = selectedSource ? { source: selectedSource } : {}
      const response = await axios.get(`${API_BASE_URL}/articles`, { params })
      setArticles(response.data)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSources = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sources`)
      setSources(response.data.sources)
    } catch (error) {
      console.error('Error loading sources:', error)
    }
  }

  const fetchNewArticles = async () => {
    setFetching(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/articles/fetch`)
      alert(response.data.message)
      await loadArticles()
    } catch (error) {
      console.error('Error fetching articles:', error)
      alert('Error fetching articles')
    } finally {
      setFetching(false)
    }
  }

  const archiveAllArticles = async () => {
    if (!confirm('Archive all current articles? They will be automatically deleted after 3 days.')) {
      return
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/articles/archive-all`)
      alert(response.data.message)
      await loadArticles()
    } catch (error) {
      console.error('Error archiving articles:', error)
      alert('Error archiving articles')
    }
  }

  const deleteAllArticles = async () => {
    if (!confirm('Delete ALL articles permanently? This cannot be undone!')) {
      return
    }
    try {
      const response = await axios.delete(`${API_BASE_URL}/articles/delete-all`)
      alert(response.data.message)
      await loadArticles()
    } catch (error) {
      console.error('Error deleting articles:', error)
      alert('Error deleting articles')
    }
  }

  const cleanupOldArchives = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/articles/cleanup`)
      alert(response.data.message)
      await loadArticles()
    } catch (error) {
      console.error('Error cleaning up archives:', error)
      alert('Error cleaning up archives')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onFetch={fetchNewArticles}
        fetching={fetching}
        sources={sources}
        selectedSource={selectedSource}
        onSourceSelect={setSelectedSource}
        onArchiveAll={archiveAllArticles}
        onDeleteAll={deleteAllArticles}
        onCleanup={cleanupOldArchives}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : (
          <ArticleList articles={articles} onRefresh={loadArticles} />
        )}
      </main>
    </div>
  )
}

export default App
