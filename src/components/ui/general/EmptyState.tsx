import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full w-full bg-background backdrop-blur-sm ${className}`}>
      <div className="flex flex-col items-center gap-3 text-gray-400">
        {icon && (
          <div className="text-4xl opacity-50">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-center px-4">
          {message}
        </span>
      </div>
    </div>
  );
};

export default EmptyState;