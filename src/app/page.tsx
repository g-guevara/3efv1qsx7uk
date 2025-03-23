"use client"

import React, { useState } from 'react';

type LocationType = 'vina' | 'santiago';
type SchedulesType = {
  vina: string[];
  santiago: string[];
};

const DataPortal = () => {
  const [schedules, setSchedules] = useState<SchedulesType>({
    vina: ['14:20', '14:20', '14:20', '14:20', '14:20', '14:20'],
    santiago: ['14:20', '14:20', '14:20', '14:20', '14:20', '14:20']
  });
  const [newTimeInputs, setNewTimeInputs] = useState<{vina: string, santiago: string}>({
    vina: '',
    santiago: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: {name: string, date: string} | null}>({
    Lunes: null,
    Martes: null,
    Miércoles: null,
    Jueves: null,
    Viernes: null,
    Sábado: null,
    Domingo: null
  });

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const handleFileUpload = (day: string, file: File) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    
    setUploadedFiles(prev => ({
      ...prev,
      [day]: {
        name: file.name,
        date: formattedDate
      }
    }));
    
    alert(`Archivo "${file.name}" cargado para ${day}`);
  };
  
  const handleFileRemove = (day: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [day]: null
    }));
  };

  const isValidTimeFormat = (time: string): boolean => {
    // Validar formato HH:MM de 24 horas
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const handleAddTime = (location: LocationType) => {
    if (newTimeInputs[location]) {
      if (isValidTimeFormat(newTimeInputs[location])) {
        setSchedules(prev => ({
          ...prev,
          [location]: [...prev[location], newTimeInputs[location]]
        }));
        // Reset the input field after adding
        setNewTimeInputs(prev => ({
          ...prev,
          [location]: ''
        }));
      } else {
        alert('Por favor, ingrese una hora válida en formato HH:MM (por ejemplo, 14:30)');
      }
    }
  };

  const handleTimeChange = (location: LocationType, index: number, value: string) => {
    const newSchedules = {...schedules};
    newSchedules[location][index] = value;
    setSchedules(newSchedules);
  };

  const handleRemoveTime = (location: LocationType, index: number) => {
    setSchedules(prev => ({
      ...prev,
      [location]: prev[location].filter((_, i) => i !== index)
    }));
  };
  
  const handleReset = () => {
    // Confirmar que el usuario realmente quiere reiniciar todo
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer.')) {
      // Reiniciar horarios
      setSchedules({
        vina: [],
        santiago: []
      });
      
      // Reiniciar archivos subidos
      setUploadedFiles({
        Lunes: null,
        Martes: null,
        Miércoles: null,
        Jueves: null,
        Viernes: null,
        Sábado: null,
        Domingo: null
      });
      
      // Reiniciar inputs de nuevos horarios
      setNewTimeInputs({
        vina: '',
        santiago: ''
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Portal de inyección de datos a Salas UAI</h1>
      
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Buses</h2>
        
        {/* Viña Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Viña</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="border border-gray-300 p-2 w-56">
              <input 
                type="text" 
                className="w-full p-2 bg-white outline-none" 
                placeholder="Agregar horario (HH:MM)"
                value={newTimeInputs.vina}
                onChange={(e) => setNewTimeInputs(prev => ({...prev, vina: e.target.value}))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTime('vina');
                  }
                }}
              />
            </div>
            <button 
              onClick={() => handleAddTime('vina')}
              className="bg-gray-200 p-2 w-10 flex items-center justify-center hover:bg-gray-300"
            >
              +
            </button>
            
            {schedules.vina.map((time, index) => (
              <div 
                key={`vina-${index}`} 
                className="border border-gray-300 p-2 w-56 relative hover:bg-gray-50 cursor-pointer group"
                onClick={() => handleRemoveTime('vina', index)}
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
        
        {/* Santiago Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Santiago</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="border border-gray-300 p-2 w-56">
              <input 
                type="text" 
                className="w-full p-2 bg-white outline-none" 
                placeholder="Agregar horario (HH:MM)"
                value={newTimeInputs.santiago}
                onChange={(e) => setNewTimeInputs(prev => ({...prev, santiago: e.target.value}))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTime('santiago');
                  }
                }}
              />
            </div>
            <button 
              onClick={() => handleAddTime('santiago')}
              className="bg-gray-200 p-2 w-10 flex items-center justify-center hover:bg-gray-300"
            >
              +
            </button>
            
            {schedules.santiago.map((time, index) => (
              <div 
                key={`santiago-${index}`} 
                className="border border-gray-300 p-2 w-56 relative hover:bg-gray-50 cursor-pointer group"
                onClick={() => handleRemoveTime('santiago', index)}
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

        {/* File Upload Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">horarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {daysOfWeek.map((day, index) => (
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
    </div>
  );
};

export default DataPortal;