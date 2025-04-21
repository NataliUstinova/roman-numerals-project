import React from 'react';

interface H1Props {
  children: React.ReactNode;
  className?: string;
}

const H1: React.FC<H1Props> = ({ children, className = '' }) => {
  return (
    <h1
      className={`text-3xl font-bold text-center mb-8 text-indigo-900 ${className}`}
    >
      {children}
    </h1>
  );
};

export default H1;
