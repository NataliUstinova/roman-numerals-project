import React from 'react';

interface InfoTooltipProps {
  show: boolean;
  message: string;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  show, 
  message, 
  className = '' 
}) => {
  return (
    <span
      className={`absolute font-normal left-0 -top-4 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10 transition-colors ${
        show
          ? 'block'
          : 'hidden group-hover:block'
      } ${className}`}
    >
      {message}
    </span>
  );
};

export default InfoTooltip;