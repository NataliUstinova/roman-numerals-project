import React from 'react';

const HowItWorks: React.FC = () => (
  <div className="mt-8">
    <h2 className="font-medium text-gray-700 mb-2">How it works:</h2>
    <ul className="list-decimal list-inside space-y-1 text-sm text-gray-500">
      <li>Enter a number (1-3999) or Roman numeral and select the conversion mode</li>
      <li>Click convert to see the result and view your conversion history</li>
    </ul>
  </div>
);

export default HowItWorks;
