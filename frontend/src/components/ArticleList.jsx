import ArticleCard from './ArticleCard'

const ArticleList = ({ articles, onRefresh }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-lg">No articles yet. Click "Fetch News" to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} onRefresh={onRefresh} />
      ))}
    </div>
  )
}

export default ArticleList
