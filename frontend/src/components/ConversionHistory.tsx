import { useConversionHistory } from '../hooks/useConversionHistory';
import Button from './ui/Button.tsx';
import { Trash2, EyeOff, History } from 'lucide-react';
import H2 from './ui/H2.tsx';

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
      <Button
        variant="secondary"
        fullWidth
        onClick={toggleHistory}
        icon={History}
        iconPosition={'left'}
      >
        Show History
      </Button>
    );
  }

  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <H2>History</H2>
        <div className="space-x-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearHistory}
            disabled={isLoading}
            icon={Trash2}
            iconPosition={'left'}
          >
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleHistory}
            icon={EyeOff}
            iconPosition={'left'}
          >
            Hide
          </Button>
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
