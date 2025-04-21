import React from 'react';

const HowItWorks: React.FC = () => (
  <section className="mt-8">
    <h2 className="font-medium text-gray-700 mb-2">How it works:</h2>
    <ul className="list-decimal list-inside space-y-1 text-sm text-gray-500">
      <li>Select the conversion mode</li>
      <li>
        Enter a <b>Number</b> (1-3999) or <b>Roman numeral</b>
      </li>
      <li>
        Click <b>Convert</b> to see the result and copy it to clipboard
      </li>
    </ul>
  </section>
);

export default HowItWorks;
