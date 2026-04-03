import React from 'react';
import { AlertCircle, Loader } from 'lucide-react';

interface LoadingProps {
  isLoading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ isLoading, error, children }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingSpinner;
