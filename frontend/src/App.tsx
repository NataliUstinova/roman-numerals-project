import { useForm } from 'react-hook-form';
import { ArrowLeftRight, List, Trash2 } from 'lucide-react';

import FormField from './components/FormField';
import ResultDisplay from './components/ResultDisplay';
import ConversionHistory from './components/ConversionHistory';
import HowItWorks from './components/HowItWorks';
import Button from './components/ui/Button.tsx';
import Title from './components/ui/Title';

import { useRomanConverter } from './hooks/useRomanConverter';
import { useConversionHistory } from './hooks/useConversionHistory';

interface ConversionFormData {
  value: string;
}

function App() {
  const {
    roman,
    number,
    error,
    mode,
    loading: conversionLoading,
    setRoman,
    setNumber,
    convert,
    switchMode,
    getValidationRules,
  } = useRomanConverter();

  const {
    conversions,
    showHistory,
    loading: historyLoading,
    error: historyError,
    fetchAll,
    removeAll,
    refreshHistory,
  } = useConversionHistory();

  // Combine loading states
  const loading = conversionLoading || historyLoading;

  // Combine error states
  const combinedError = error || historyError;

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

  const onSubmit = async (data: ConversionFormData) => {
    const success = await convert(data.value);
    if (success && showHistory) {
      await refreshHistory();
    }
  };

  const handleSwitchMode = () => {
    switchMode();
    reset({ value: '' });
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

          {combinedError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {combinedError}
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
              onClick={handleSwitchMode}
              disabled={loading}
              variant="icon"
              icon={<ArrowLeftRight className="w-5 h-5" />}
              aria-label="Switch conversion mode"
            />
          </div>

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

          {/* Conversion history display */}
          <ConversionHistory conversions={conversions} show={showHistory} />

          <HowItWorks />
        </div>
      </div>
    </div>
  );
}

export default App;
