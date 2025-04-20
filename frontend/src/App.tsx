import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight, List, Trash2 } from 'lucide-react';

import FormField from './components/FormField';
import ResultDisplay from './components/ResultDisplay';
import ConversionHistory, { Conversion } from './components/ConversionHistory';
import HowItWorks from './components/HowItWorks';
import Button from './components/ui/Button.tsx';
import Title from './components/ui/Title';

interface ConversionFormData {
  value: string;
}

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
    reset,
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
        setError(
          errorData.error ||
            `Failed to convert ${
              endpoint === 'roman' ? 'number' : 'Roman numeral'
            }`,
        );
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
    // If history is already showing, just hide it
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/all');

      if (!response.ok) {
        setError('Failed to fetch conversions');
        return;
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
        <Title>Roman Numerals Converter</Title>

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
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={loading}
              fullWidth
            >
              {loading ? 'Converting...' : 'Convert'}
            </Button>
            <Button
              onClick={handleSwitch}
              disabled={loading}
              variant="icon"
              icon={<ArrowLeftRight className="w-5 h-5" />}
              aria-label="Switch conversion mode"
            />
          </div>

          {/* Buttons for history management */}
          <div className="flex gap-4 mt-4">
            <Button
              onClick={fetchAllConversions}
              isLoading={loading}
              variant="secondary"
              fullWidth
              icon={<List className="w-4 h-4" />}
            >
              {showHistory ? 'Hide History' : 'View History'}
            </Button>
            <Button
              onClick={removeAllConversions}
              isLoading={loading}
              variant="red"
              fullWidth
              icon={<Trash2 className="w-4 h-4" />}
            >
              Clear History
            </Button>
          </div>

          {/* Conversion history display */}
          <ConversionHistory conversions={conversions} show={showHistory} />

          <HowItWorks />
        </div>
      </div>
    </div>
  );
}

export default App;
