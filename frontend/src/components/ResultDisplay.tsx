import React from 'react';

interface ResultDisplayProps {
  label: string;
  value: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ label, value }) => (
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

export default ResultDisplay;