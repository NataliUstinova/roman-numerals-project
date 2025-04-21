import { useForm } from 'react-hook-form';
import { useRomanConverter } from '../hooks/useRomanConverter';
import Button from './ui/Button.tsx';

export default function ConverterForm() {
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
          onClick={switchMode}
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
          <p className="text-xl font-bold text-indigo-700 h-12">
            {mode === 'toRoman' ? roman : number}
          </p>
        </div>

        <Button variant="primary" type="submit" disabled={loading}>
          Convert
        </Button>
      </div>
    </form>
  );
}
