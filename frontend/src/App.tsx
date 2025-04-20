import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight, List, Trash2 } from 'lucide-react';

interface Conversion {
  _id: string;
  inputValue: string;
  convertedValue: string;
  type: 'arabic-to-roman' | 'roman-to-arabic';
  createdAt: string;
  __v: number;
}

interface ConversionFormData {
  value: string;
}

const FormField = ({ 
  label, 
  register, 
  name, 
  validation, 
  error, 
  placeholder, 
  type = "text",
  onChange,
  value
}: {
  label: string;
  register: any;
  name: string;
  validation: any;
  error: any;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      {...register(name, validation)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

// Result display component
const ResultDisplay = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="w-full px-4 py-2 min-h-[42px] flex items-center font-medium text-indigo-700">
      {value || (
        <span className="text-gray-400">
          Result will appear here...
        </span>
      )}
    </div>
  </div>
);

function App() {
  const [roman, setRoman] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ConversionFormData>({
    defaultValues: {
      value: '',
    },
  });

  const makeConversionRequest = async (endpoint: string, value: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/${endpoint}/${value}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || `Failed to convert ${endpoint === 'roman' ? 'number' : 'Roman numeral'}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ConversionFormData) => {
    setError('');
    
    if (mode === 'toRoman') {
      const num = parseInt(data.value);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return;
      }
      
      const responseData = await makeConversionRequest('roman', num.toString());
      if (responseData) {
        setRoman(responseData.convertedValue);
        
        if (showHistory) {
          await fetchAllConversions();
        }
      }
    } else {
      const romanValue = data.value.toUpperCase();
      const responseData = await makeConversionRequest('arabic', romanValue);
      if (responseData) {
        setNumber(responseData.convertedValue.toString());
        
        if (showHistory) {
          await fetchAllConversions();
        }
      }
    }
  };

  const fetchAllConversions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/all');

      if (!response.ok) {
        setError('Failed to fetch conversions');
        return;
      }

      const data = await response.json();
      setConversions(data);

      if (!showHistory) {
        setShowHistory(true);
      }
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
        setError('Failed to remove conversions');
        return;
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

  const handleSwitch = () => {
    setMode(mode === 'toRoman' ? 'toNumber' : 'toRoman');
    setNumber('');
    setRoman('');
    setError('');
    reset({ value: '' });
  };

  const getValidationRules = () => {
    if (mode === 'toRoman') {
      return {
        required: 'Number is required',
        min: { value: 1, message: 'Number must be at least 1' },
        max: { value: 3999, message: 'Number must be at most 3999' },
      };
    } else {
      return {
        required: 'Roman numeral is required',
        pattern: {
          value: /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i,
          message: 'Invalid Roman numeral format',
        },
      };
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
              <FormField
                label="Enter a number (1-3999)"
                register={register}
                name="value"
                validation={getValidationRules()}
                error={errors.value}
                placeholder="Enter a number..."
                type="number"
                onChange={e => setNumber(e.target.value)}
                value={number}
              />
              <ResultDisplay label="Roman Numeral" value={roman} />
            </>
          ) : (
            <>
              <FormField
                label="Enter a Roman numeral"
                register={register}
                name="value"
                validation={getValidationRules()}
                error={errors.value}
                placeholder="Enter a Roman numeral..."
                onChange={e => setRoman(e.target.value.toUpperCase())}
                value={roman}
              />
              <ResultDisplay label="Number" value={number} />
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSubmit(onSubmit)}
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
