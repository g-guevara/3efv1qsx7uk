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

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
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
                        // Aquí podrías manejar el archivo subido
                        console.log(`Archivo para ${day}:`, e.target.files[0].name);
                        alert(`Archivo "${e.target.files[0].name}" seleccionado para ${day}`);
                      }
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-base">subir archivos</span>
                </label>
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
      </div>
    </div>
  );
};

export default DataPortal;