import React from 'react';

const HowItWorks: React.FC = () => (
  <div className="mt-8">
    <h2 className="font-medium text-gray-700 mb-2">How it works:</h2>
    <ul className="list-decimal list-inside space-y-1 text-sm text-gray-500">
      <li>Enter a number between 1 and 3999 to convert to Roman numerals</li>
      <li>Switch modes to convert Roman numerals back to numbers</li>
      <li>Click the convert button to see the result</li>
      <li>
        View your conversion history or clear it using the buttons 'View
        History' and 'Clear History'
      </li>
    </ul>
  </div>
);

export default HowItWorks;
