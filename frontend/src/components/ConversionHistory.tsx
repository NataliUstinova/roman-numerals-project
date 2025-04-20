import Button from './ui/Button.tsx';
import { List, Trash2 } from 'lucide-react';
import { useConversionHistory } from '../hooks/useConversionHistory.ts';

export interface Conversion {
  _id: string;
  inputValue: string;
  convertedValue: string;
  type: 'arabic-to-roman' | 'roman-to-arabic';
  createdAt: string;
  __v: number;
}

const ConversionHistory: React.FC = () => {
  const { conversions, showHistory, loading, error, fetchAll, removeAll } =
    useConversionHistory();

  return (
    <section className={'mt-6 flex flex-col gap-4'}>
      {/* Buttons for history management */}
      <div className="flex gap-4 mt-4">
        <Button
          onClick={fetchAll}
          isLoading={loading}
          variant="secondary"
          fullWidth
          icon={<List className="w-4 h-4" />}
        >
          {showHistory ? 'Hide History' : 'View History'}
        </Button>
        <Button
          onClick={removeAll}
          isLoading={loading}
          variant="red"
          fullWidth
          icon={<Trash2 className="w-4 h-4" />}
        >
          Clear History
        </Button>
      </div>
      {showHistory && (
        <div className="mt-6 border rounded-md overflow-hidden">
          <h3 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">
            Conversion History
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {conversions.length > 0 ? (
              conversions.map(conversion => (
                <div
                  key={conversion._id}
                  className="p-3 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {conversion.type === 'arabic-to-roman'
                        ? 'Number → Roman'
                        : 'Roman → Number'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(conversion.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-600">
                      {conversion.inputValue}
                    </span>
                    <span className="mx-2">→</span>
                    <span className="text-indigo-600 font-medium">
                      {conversion.convertedValue}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                No conversion history found
              </div>
            )}
            {error && <p className="text-center p-4 text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default ConversionHistory;
