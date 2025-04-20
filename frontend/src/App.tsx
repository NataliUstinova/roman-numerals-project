import { useState } from 'react';
import { ArrowLeftRight, List, Trash2 } from 'lucide-react';

interface Conversion {
  _id: string;
  inputValue: string;
  convertedValue: string;
  type: string;
  createdAt: string;
  __v: number;
}

function App() {
  const [number, setNumber] = useState('');
  const [roman, setRoman] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setError('');
    setLoading(true);

    try {
      if (mode === 'toRoman') {
        const num = parseInt(number);
        if (isNaN(num)) {
          setError('Please enter a valid number');
          return;
        }

        // Use the server endpoint for Arabic to Roman conversion
        const response = await fetch(`/roman/${num}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to convert number');
        }

        const data = await response.json();
        setRoman(data.convertedValue);
      } else {
        if (!roman.trim()) {
          setError('Please enter a Roman numeral');
          return;
        }

        // Use the server endpoint for Roman to Arabic conversion
        const response = await fetch(`/arabic/${roman.toUpperCase()}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to convert Roman numeral');
        }

        const data = await response.json();
        // Update to use convertedValue instead of result
        setNumber(data.convertedValue.toString());
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setMode(mode === 'toRoman' ? 'toNumber' : 'toRoman');
    setNumber('');
    setRoman('');
    setError('');
  };

  const fetchAllConversions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/all');

      if (!response.ok) {
        throw new Error('Failed to fetch conversions');
      }

      const data = await response.json();
      setConversions(data);
      setShowHistory(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load conversion history',
      );
    } finally {
      setLoading(false);
    }
  };

  const removeAllConversions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/remove', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove conversions');
      }

      setConversions([]);
      setError('');
    } catch (err) {
      console.error('Remove error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to clear conversion history',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
          Roman Numerals Converter
        </h1>

        <div className="space-y-6">
          {mode === 'toRoman' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a number (1-3999)
                </label>
                <input
                  type="number"
                  min="1"
                  max="3999"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a number..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roman Numeral
                </label>
                <input
                  type="text"
                  value={roman}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
                  placeholder="Result will appear here..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a Roman numeral
                </label>
                <input
                  type="text"
                  value={roman}
                  onChange={e => setRoman(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a Roman numeral..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number
                </label>
                <input
                  type="text"
                  value={number}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
                  placeholder="Result will appear here..."
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleConvert}
              disabled={loading}
              className={`flex-1 ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center`}
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>
            <button
              onClick={handleSwitch}
              disabled={loading}
              className="flex items-center justify-center w-12 h-10 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Buttons for history management */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={fetchAllConversions}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 ${
                loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white px-4 py-2 rounded-md transition-colors`}
            >
              <List className="w-4 h-4" />
              View History
            </button>
            <button
              onClick={removeAllConversions}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 ${
                loading ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'
              } text-white px-4 py-2 rounded-md transition-colors`}
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>

          {/* Conversion history display */}
          {showHistory && (
            <div className="mt-6 border rounded-md overflow-hidden">
              <h3 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">
                Conversion History
              </h3>
              <div className="max-h-60 overflow-y-auto">
                {conversions.length > 0 ? (
                  conversions.map((conversion, index) => (
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
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <h2 className="font-medium text-gray-700 mb-2">How it works:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Enter a number between 1 and 3999 to convert to Roman numerals
              </li>
              <li>Or switch modes to convert Roman numerals back to numbers</li>
              <li>Click the convert button to see the result</li>
              <li>
                View your conversion history or clear it using the buttons 'View
                History' and 'Clear History'
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
