import { useForm } from 'react-hook-form';
import { useRomanConverter } from '../hooks/useRomanConverter';
import Button from './ui/Button.tsx';
import { ArrowRightLeft, Calculator, ClipboardCopy, Check } from 'lucide-react';
import { useState } from 'react';

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
        <h2 className="text-lg font-semibold text-gray-700">
          {mode === 'toRoman' ? 'Number to Roman' : 'Roman to Number'}
        </h2>
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
        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter a number (1-3999)
          </label>
          <input
            id="number"
            type="number"
            {...register('number', getValidationRules())}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="42..."
            onChange={clearError}
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">
              {errors.number.message as string}
            </p>
          )}
        </div>
      ) : (
        <div>
          <label
            htmlFor="roman"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter a Roman numeral
          </label>
          <input
            id="roman"
            type="text"
            {...register('roman', getValidationRules())}
            className="w-full p-2 border rounded-md uppercase focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="XLII..."
            onChange={clearError}
          />
          {errors.roman && (
            <p className="mt-1 text-sm text-red-600">
              {errors.roman.message as string}
            </p>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="text-sm text-gray-500">Result:</p>
          <div className="relative">
            <p
              className="text-xl font-bold text-indigo-700 h-12 cursor-pointer p-1 pb-3 rounded flex items-center gap-2 relative group"
              onClick={() => {
                if (result) {
                  navigator.clipboard.writeText(result.toString());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
            >
              {result}
              {result && (
                <span
                  className={`absolute font-normal left-0 -top-4 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10 transition-colors ${
                    copied
                      ? 'bg-green-600 text-white block'
                      : 'bg-gray-300 text-gray-700 hidden group-hover:block'
                  }`}
                >
                  {copied
                    ? 'Copied to clipboard!'
                    : 'Click to copy to clipboard'}
                </span>
              )}
              {result &&
                (copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <ClipboardCopy size={16} className="text-gray-400" />
                ))}
            </p>
          </div>
        </div>

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
