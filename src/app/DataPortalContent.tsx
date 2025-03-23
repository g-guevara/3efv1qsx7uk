import React, { useState } from 'react';
import { saveBusSchedule, processExcelFile, resetAllData } from '../services/apiService';

// Tipo para los distintos campus
type CampusType = 'vina' | 'penalolen' | 'errazuriz' | 'vitacura' | string;
type BusType = 'Subida' | 'Regreso';
type SchedulesType = {
  [campus: string]: {
    [destination: string]: {
      Subida: string[];
      Regreso: string[];
    };
  };
};

type UploadedFilesType = {
  [key: string]: {name: string, date: string} | null
};

type DataPortalContentProps = {
  schedules: SchedulesType;
  campuses: string[];
  newTimeInputs: {[key: string]: string};
  uploadedFiles: UploadedFilesType;
  daysOfWeek: string[];
  handleAddTime: (campus: string, destination: string, busType: BusType) => void;
  handleRemoveTime: (campus: string, destination: string, busType: BusType, index: number) => void;
  handleFileUpload: (day: string, file: File) => void;
  handleFileRemove: (day: string) => void;
  handleReset: () => void;
  handleAddCampus: () => void;
  handleAddDestination: (campus: string, destination: string) => void;
  setNewTimeInputs: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
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
  handleAddDestination,
  setNewTimeInputs
}) => {
  // Estado para nuevos destinos
  const [newDestination, setNewDestination] = useState<{[campus: string]: string}>({});
  
  // Función para capitalizar la primera letra (para mostrar los nombres de campus)
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
  };
  
  // Función para guardar un horario de bus en la base de datos
  const saveBusToDatabase = async (campus: string, destination: string, time: string, busType: BusType) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const busData = {
        Tipo: "Buses",
        Evento: `${busType} bus`, // "Subida bus" o "Regreso bus"
        Fecha: formattedDate,
        Inicio: time,
        Fin: time,
        Sala: destination, // El destino seleccionado
        Edificio: "paradero",
        Campus: campus,
        Ciudad: "", // Campo vacío por ahora
        fechaActualizacion: currentDate.toISOString()
      };
      
      await saveBusSchedule(busData);
      console.log(`Horario guardado para ${campus}: ${time}, destino: ${destination}, tipo: ${busType}`);
    } catch (error) {
      console.error('Error al guardar el horario:', error);
      alert(`Error al guardar el horario en la base de datos: ${error}`);
    }
  };
  
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
  
  // Función para agregar un nuevo destino
  const handleAddNewDestination = (campus: string) => {
    if (newDestination[campus]?.trim()) {
      handleAddDestination(campus, newDestination[campus]);
      setNewDestination(prev => ({...prev, [campus]: ''}));
    } else {
      alert("Por favor ingrese un nombre de destino válido");
    }
  };
  
  // Función para agregar un nuevo horario con validación
  const handleAddTimeWithValidation = async (campus: string, destination: string, busType: BusType) => {
    const inputKey = `${campus}-${destination}-${busType}`;
    const timeValue = newTimeInputs[inputKey];
    
    if (!timeValue || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeValue)) {
      alert('Por favor, ingrese una hora válida en formato HH:MM (por ejemplo, 14:30)');
      return;
    }
    
    // Guardar el horario en la base de datos
    await saveBusToDatabase(campus, destination, timeValue, busType);
    
    // Actualizar la UI
    handleAddTime(campus, destination, busType);
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
          Agregar campus
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
          <div className="mb-8 border border-gray-200 p-4 rounded-lg" key={campus}>
            <h3 className="text-lg font-medium mb-4">{capitalizeFirstLetter(campus)}</h3>
            
            {schedules[campus] && Object.keys(schedules[campus]).map(destination => (
              <div key={`${campus}-${destination}`} className="mb-6">
                <div className="w-48 border border-purple-200 bg-purple-100 p-2 text-purple-700 rounded-md mb-2">
                  {destination}
                </div>
                
                {/* Sección para Subida */}
                <div className="mb-4 ml-4">
                  <div className="text-gray-600 mb-2">Subida</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      className="p-2 border border-gray-300 w-32 mr-2"
                      placeholder="--:--"
                      value={newTimeInputs[`${campus}-${destination}-Subida`] || ''}
                      onChange={(e) => setNewTimeInputs(prev => ({
                        ...prev,
                        [`${campus}-${destination}-Subida`]: e.target.value
                      }))}
                    />
                    <button
                      className="p-2 w-10 bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      onClick={() => handleAddTimeWithValidation(campus, destination, 'Subida')}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {schedules[campus][destination]?.Subida.map((time, index) => (
                      <div
                        key={`time-${campus}-${destination}-Subida-${index}`}
                        className="p-2 border border-gray-300 cursor-pointer bg-gray-50"
                        onClick={() => handleRemoveTime(campus, destination, 'Subida', index)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sección para Regreso */}
                <div className="mb-4 ml-4">
                  <div className="text-gray-600 mb-2">Regreso</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      className="p-2 border border-gray-300 w-32 mr-2"
                      placeholder="--:--"
                      value={newTimeInputs[`${campus}-${destination}-Regreso`] || ''}
                      onChange={(e) => setNewTimeInputs(prev => ({
                        ...prev,
                        [`${campus}-${destination}-Regreso`]: e.target.value
                      }))}
                    />
                    <button
                      className="p-2 w-10 bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      onClick={() => handleAddTimeWithValidation(campus, destination, 'Regreso')}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {schedules[campus][destination]?.Regreso.map((time, index) => (
                      <div
                        key={`time-${campus}-${destination}-Regreso-${index}`}
                        className="p-2 border border-gray-300 cursor-pointer bg-gray-50"
                        onClick={() => handleRemoveTime(campus, destination, 'Regreso', index)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  type="text"
                  className="p-2 border border-purple-300 w-48 mr-2"
                  placeholder="agregar destino"
                  value={newDestination[campus] || ''}
                  onChange={(e) => setNewDestination(prev => ({...prev, [campus]: e.target.value}))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNewDestination(campus);
                    }
                  }}
                />
                <button
                  className="p-2 bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
                  onClick={() => handleAddNewDestination(campus)}
                >
                  agregar destino
                </button>
              </div>
            </div>
          </div>
        ))
      )}

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

export default DataPortalContent;