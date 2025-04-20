import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight } from 'lucide-react';

import FormField from './FormField';
import ResultDisplay from './ResultDisplay';
import Button from './ui/Button.tsx';
import { useRomanConverter } from '../hooks/useRomanConverter.ts';
import { useConversionHistory } from '../hooks/useConversionHistory.ts';
import { useHistoryStore } from '../store/historyStore';

interface ConversionFormData {
  value: string;
}

const ConverterForm: React.FC = () => {
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

  const {
    roman,
    number,
    error,
    mode,
    loading,
    setRoman,
    setNumber,
    convert,
    switchMode,
    getValidationRules,
  } = useRomanConverter();

  const { refreshHistory } = useConversionHistory();
  const showHistory = useHistoryStore(state => state.showHistory);

  const onSubmit = async (data: ConversionFormData) => {
    const success = await convert(data.value);
    if (success && showHistory) {
      await refreshHistory();
    }
  };

  const handleSwitchMode = () => {
    reset({ value: '' });
    switchMode();
  };

  return (
    <>
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
        <Button onClick={handleSubmit(onSubmit)} isLoading={loading} fullWidth>
          Convert
        </Button>
        <Button
          onClick={handleSwitchMode}
          disabled={loading}
          variant="icon"
          icon={<ArrowLeftRight className="w-5 h-5" />}
          aria-label="Switch conversion mode"
        />
      </div>
    </>
  );
};

export default ConverterForm;
