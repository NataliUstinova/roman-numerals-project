import { useForm } from 'react-hook-form';
import { useRomanConverter } from '../hooks/useRomanConverter';
import Button from './ui/Button.tsx';
import { ArrowRightLeft, Calculator } from 'lucide-react';
import { useState } from 'react';
import NumberInput from './converter/NumberInput';
import RomanInput from './converter/RomanInput';
import ResultDisplay from './converter/ResultDisplay';
import H2 from './ui/H2.tsx';

export default function ConverterForm() {
  const [copied, setCopied] = useState(false);
  const {
    roman,
    number,
    error,
    mode,
    loading,
    convert,
    switchMode,
    getValidationRules,
    clearError,
  } = useRomanConverter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    const value = mode === 'toRoman' ? data.number : data.roman;
    const success = await convert(value);

    if (success) {
      reset();
    }
  };

  const result = mode === 'toRoman' ? roman : number;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <H2>{mode === 'toRoman' ? 'Number to Roman' : 'Roman to Number'}</H2>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => {
            switchMode();
            reset();
          }}
          icon={ArrowRightLeft}
          iconPosition={'left'}
        >
          Switch Mode
        </Button>
      </div>

      {mode === 'toRoman' ? (
        <NumberInput
          register={register}
          validationRules={getValidationRules()}
          error={errors.number}
          clearError={clearError}
        />
      ) : (
        <RomanInput
          register={register}
          validationRules={getValidationRules()}
          error={errors.roman}
          clearError={clearError}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between items-center">
        <ResultDisplay result={result} copied={copied} setCopied={setCopied} />

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          iconPosition={'right'}
          icon={Calculator}
          className={'flex-1'}
        >
          Convert
        </Button>
      </div>
    </form>
  );
}
