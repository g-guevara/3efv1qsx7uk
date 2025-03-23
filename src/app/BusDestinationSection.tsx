import React, { useState } from 'react';
import { saveBusSchedule } from '../services/apiService';

// Tipos
type BusType = 'Subida' | 'Regreso';
type SchedulesType = {
  [campus: string]: {
    [destination: string]: {
      Subida: string[];
      Regreso: string[];
    };
  };
};

type BusDestinationSectionProps = {
  campus: string;
  schedules: SchedulesType;
  newTimeInputs: {[key: string]: string};
  handleAddTime: (campus: string, destination: string, busType: BusType) => void;
  handleRemoveTime: (campus: string, destination: string, busType: BusType, index: number) => void;
  handleAddDestination: (campus: string, destination: string) => void;
  setNewTimeInputs: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
};

const BusDestinationSection: React.FC<BusDestinationSectionProps> = ({
  campus,
  schedules,
  newTimeInputs,
  handleAddTime,
  handleRemoveTime,
  handleAddDestination,
  setNewTimeInputs
}) => {
  // Estado para nuevos destinos
  const [newDestination, setNewDestination] = useState<string>('');
  
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
  
  // Función para agregar un nuevo destino
  const handleAddNewDestination = () => {
    if (newDestination?.trim()) {
      handleAddDestination(campus, newDestination);
      setNewDestination('');
    } else {
      alert("Por favor ingrese un nombre de destino válido");
    }
  };
  
  // Función para agregar un nuevo horario con validación
  const handleAddTimeWithValidation = async (destination: string, busType: BusType) => {
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
  
  return (
    <>
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
                onClick={() => handleAddTimeWithValidation(destination, 'Subida')}
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
                onClick={() => handleAddTimeWithValidation(destination, 'Regreso')}
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
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddNewDestination();
              }
            }}
          />
          <button
            className="p-2 bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
            onClick={handleAddNewDestination}
          >
            agregar destino
          </button>
        </div>
      </div>
    </>
  );
};

export default BusDestinationSection;