const Header = ({ onFetch, fetching, sources, selectedSource, onSourceSelect }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tech News Aggregator</h1>
            <p className="mt-1 text-sm text-gray-500">Stay updated with the latest tech news</p>
          </div>
          <button
            onClick={onFetch}
            disabled={fetching}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {fetching ? 'Fetching...' : 'Fetch News'}
          </button>
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
