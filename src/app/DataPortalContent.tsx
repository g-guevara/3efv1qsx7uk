import React from 'react';

// Tipo para los distintos campus
type CampusType = 'vina' | 'penalolen' | 'errazuriz' | 'vitacura' | string;
type SchedulesType = {
  [campus: string]: string[];
};

type UploadedFilesType = {
  [key: string]: {name: string, date: string} | null
};

type DataPortalContentProps = {
  schedules: SchedulesType;
  campuses: string[];
  newTimeInputs: {[campus: string]: string};
  uploadedFiles: UploadedFilesType;
  daysOfWeek: string[];
  handleAddTime: (campus: CampusType) => void;
  handleRemoveTime: (campus: CampusType, index: number) => void;
  handleTimeChange: (campus: CampusType, index: number, value: string) => void;
  handleFileUpload: (day: string, file: File) => void;
  handleFileRemove: (day: string) => void;
  handleReset: () => void;
  handleAddCampus: () => void;
  setNewTimeInputs: React.Dispatch<React.SetStateAction<{[campus: string]: string}>>;
};

const DataPortalContent: React.FC<DataPortalContentProps> = ({
  schedules,
  campuses,
  newTimeInputs,
  uploadedFiles,
  daysOfWeek,
  handleAddTime,
  handleRemoveTime,
  handleFileUpload,
  handleFileRemove,
  handleReset,
  handleAddCampus,
  setNewTimeInputs
}) => {
  // Función para capitalizar la primera letra (para mostrar los nombres de campus)
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-600">Buses</h2>
        <button 
          onClick={handleAddCampus}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Agregar Campus
        </button>
      </div>
      
      {campuses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">No hay campus definidos</p>
          <p className="text-gray-400">Haga clic en "Agregar Campus" para comenzar</p>
        </div>
      ) : (
        // Campus Sections
        campuses.map(campus => (
          <div className="mb-8" key={campus}>
            <h3 className="text-lg font-medium mb-3">{capitalizeFirstLetter(campus)}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="border border-gray-300 p-2 w-56">
                <input 
                  type="text" 
                  className="w-full p-2 bg-white outline-none" 
                  placeholder="Agregar horario (HH:MM)"
                  value={newTimeInputs[campus] || ''}
                  onChange={(e) => setNewTimeInputs(prev => ({...prev, [campus]: e.target.value}))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTime(campus);
                    }
                  }}
                />
              </div>
              <button 
                onClick={() => handleAddTime(campus)}
                className="bg-gray-200 p-2 w-10 flex items-center justify-center hover:bg-gray-300"
              >
                +
              </button>
              
              {schedules[campus] && schedules[campus].map((time, index) => (
                <div 
                  key={`${campus}-${index}`} 
                  className="border border-gray-300 p-2 w-56 relative hover:bg-gray-50 cursor-pointer group"
                  onClick={() => handleRemoveTime(campus, index)}
                >
                  <input 
                    type="time" 
                    className="w-full p-2 text-gray-700 pointer-events-none" 
                    value={time}
                    readOnly
                  />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-red-100 bg-opacity-50 transition-opacity">
                    <span className="text-red-600 font-medium">Eliminar</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* File Upload Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Horarios</h2>
        
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
                    accept=".pdf,.doc,.docx,.xlsx,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(day, e.target.files[0]);
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
          onClick={handleReset}
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

export default DataPortalContent;