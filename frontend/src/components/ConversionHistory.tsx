import { useConversionHistory } from '../hooks/useConversionHistory';
export default function ConversionHistory() {
  const {
    conversions,
    isLoading,
    error,
    showHistory,
    toggleHistory,
    handleClearHistory,
  } = useConversionHistory();

  if (!showHistory) {
    return (
      <button
        onClick={toggleHistory}
        className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
      >
        Show History
      </button>
    );
  }

  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Conversion History
        </h2>
        <div className="space-x-2">
          <button
            onClick={handleClearHistory}
            disabled={isLoading}
            className="text-sm py-1 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Clear All
          </button>
          <button
            onClick={toggleHistory}
            className="text-sm py-1 px-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Hide
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          {error instanceof Error ? error.message : 'Error loading history'}
        </div>
      ) : conversions && conversions.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {conversions.map(conversion => (
            <li
              key={conversion._id}
              className="text-sm p-2 bg-white rounded border"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {conversion.type === 'arabic-to-roman'
                    ? 'Number → Roman'
                    : 'Roman → Number'}
                  :
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(conversion.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-gray-600">{conversion.inputValue}</span>
                <span className="mx-2">→</span>
                <span className="font-semibold">
                  {conversion.convertedValue}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No conversion history yet
        </div>
      )}
    </div>
  );
}
