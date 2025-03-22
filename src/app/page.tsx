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

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const handleAddTime = (location: LocationType) => {
    setSchedules(prev => ({
      ...prev,
      [location]: [...prev[location], '14:20']
    }));
  };

  const handleTimeChange = (location: LocationType, index: number, value: string) => {
    const newSchedules = {...schedules};
    newSchedules[location][index] = value;
    setSchedules(newSchedules);
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
                className="w-full p-2 text-red-600 bg-white outline-none" 
                placeholder="Agregar horario"
                value="input"
                readOnly
              />
            </div>
            <button 
              onClick={() => handleAddTime('vina')}
              className="bg-gray-200 p-2 w-10 flex items-center justify-center"
            >
              +
            </button>
            
            {schedules.vina.map((time, index) => (
              <div key={`vina-${index}`} className="border border-gray-300 p-2 w-56">
                <input 
                  type="time" 
                  className="w-full p-2 text-gray-700" 
                  value={time}
                  onChange={(e) => handleTimeChange('vina', index, e.target.value)}
                />
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
                className="w-full p-2 text-red-600 bg-white outline-none" 
                placeholder="Agregar horario"
                value="input"
                readOnly
              />
            </div>
            <button 
              onClick={() => handleAddTime('santiago')}
              className="bg-gray-200 p-2 w-10 flex items-center justify-center"
            >
              +
            </button>
            
            {schedules.santiago.map((time, index) => (
              <div key={`santiago-${index}`} className="border border-gray-300 p-2 w-56">
                <input 
                  type="time" 
                  className="w-full p-2 text-gray-700" 
                  value={time}
                  onChange={(e) => handleTimeChange('santiago', index, e.target.value)}
                />
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
                  className={`border rounded-md bg-gray-100 w-full p-4 mb-2 flex flex-col items-center cursor-pointer hover:bg-gray-200 transition-colors ${index === 2 ? 'border-red-500' : ''}`}
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