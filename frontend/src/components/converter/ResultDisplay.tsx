import React from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

interface ResultDisplayProps {
  result: string | number | null;
  copied: boolean;
  setCopied: (value: boolean) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  copied, 
  setCopied 
}) => {
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1">
      <p className="text-sm text-gray-500">Result:</p>
      <div className="relative">
        <p
          className="text-xl font-bold text-indigo-700 h-12 cursor-pointer p-1 pb-3 rounded flex items-center gap-2 relative group"
          onClick={handleCopy}
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
  );
};

export default ResultDisplay;