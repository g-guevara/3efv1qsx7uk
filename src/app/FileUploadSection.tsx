import React from 'react';
import { processExcelFile, resetAllData } from '../services/apiService';

type UploadedFilesType = {
  [key: string]: {name: string, date: string} | null
};

type FileUploadSectionProps = {
  uploadedFiles: UploadedFilesType;
  daysOfWeek: string[];
  handleFileUpload: (day: string, file: File) => void;
  handleFileRemove: (day: string) => void;
  handleReset: () => void;
};

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
  daysOfWeek,
  handleFileUpload,
  handleFileRemove,
  handleReset
}) => {
  
  // Función modificada para manejar la subida de archivos
  const handleFileUploadWithProcessing = async (day: string, file: File) => {
    try {
      // Primero procesamos el archivo para enviarlo a la API
      await processExcelFile(file, day);
      
      // Luego actualizamos la UI con la información del archivo
      handleFileUpload(day, file);
    } catch (error) {
      console.error('Error procesando el archivo:', error);
      alert(`Error al procesar el archivo: ${error}`);
    }
  };
  
  // Función modificada para reiniciar también en la base de datos
  const handleResetWithDatabase = async () => {
    // Confirmar que el usuario realmente quiere reiniciar todo
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer y eliminará todos los datos de la base de datos.')) {
      try {
        // Primero eliminamos los datos en el servidor
        await resetAllData();
        
        // Luego hacemos el reinicio local
        handleReset();
        
        // Confirmación para el usuario
        alert('Todos los datos han sido eliminados correctamente');
      } catch (error) {
        console.error('Error al reiniciar datos:', error);
        alert(`Error al reiniciar datos: ${error}`);
      }
    }
  };
  
  return (
    <div>
      {/* File Upload Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">horarios</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {daysOfWeek.map((day) => (
            <div 
              key={day} 
              className="flex flex-col items-center"
            >
              {!uploadedFiles[day] ? (
                <label 
                  className="border rounded-md bg-gray-100 w-full p-4 mb-2 flex flex-col items-center cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <input
                    type="file"
                    id={`file-${day}`}
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUploadWithProcessing(day, e.target.files[0]);
                      }
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-base">subir archivos</span>
                </label>
              ) : (
                <div className="border rounded-md bg-white w-full p-4 mb-2 flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleFileRemove(day)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="text-sm font-medium truncate w-full text-center">{uploadedFiles[day]?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{uploadedFiles[day]?.date}</p>
                </div>
              )}
              <span className="text-sm">{day}</span>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <div className="border rounded-md bg-gray-100 w-full p-4 mb-2 flex flex-col items-center">
              <span className="text-base mb-2">...</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón de reinicio */}
      <div className="w-full flex justify-center mt-12 mb-6">
        <button 
          onClick={handleResetWithDatabase}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reiniciar todos los datos
        </button>
      </div>
    </div>
  );
};

export default FileUploadSection;