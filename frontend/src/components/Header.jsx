const Header = ({ onFetch, fetching, sources, selectedSource, onSourceSelect, onArchiveAll, onDeleteAll, onCleanup }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tech News Aggregator</h1>
            <p className="mt-1 text-sm text-gray-500">Stay updated with the latest tech news</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onFetch}
              disabled={fetching}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {fetching ? 'Fetching...' : 'Fetch News'}
            </button>
            <button
              onClick={onArchiveAll}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              title="Archive all articles (auto-delete after 3 days)"
            >
              Archive All
            </button>
            <button
              onClick={onDeleteAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              title="Permanently delete all articles"
            >
              Delete All
            </button>
            <button
              onClick={onCleanup}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              title="Clean up archives older than 3 days"
            >
              Cleanup
            </button>
          </div>
        </div>

        {sources.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => onSourceSelect(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !selectedSource
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Sources
            </button>
            {sources.map(source => (
              <button
                key={source}
                onClick={() => onSourceSelect(source)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedSource === source
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
