import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600 font-medium">Cargando datos desde la base de datos...</p>
    </div>
  );
};

export default LoadingSpinner;