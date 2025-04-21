import React from 'react';

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

const H1: React.FC<H2Props> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-700 ${className}`}>
      {children}
    </h2>
  );
};

export default H1;
