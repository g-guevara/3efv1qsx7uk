import React from 'react';
import BusDestinationSection from './BusDestinationSection';

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

type BusSectionProps = {
  schedules: SchedulesType;
  campuses: string[];
  newTimeInputs: {[key: string]: string};
  handleAddTime: (campus: string, destination: string, busType: BusType) => void;
  handleRemoveTime: (campus: string, destination: string, busType: BusType, index: number) => void;
  handleAddCampus: () => void;
  handleAddDestination: (campus: string, destination: string) => void;
  setNewTimeInputs: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
};

const BusSection: React.FC<BusSectionProps> = ({
  schedules,
  campuses,
  newTimeInputs,
  handleAddTime,
  handleRemoveTime,
  handleAddCampus,
  handleAddDestination,
  setNewTimeInputs
}) => {
  // Función para capitalizar la primera letra (para mostrar los nombres de campus)
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
  };
  
  return (
    <div>
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
            
            {/* Componente para destinos y horarios */}
            <BusDestinationSection
              campus={campus}
              schedules={schedules}
              newTimeInputs={newTimeInputs}
              handleAddTime={handleAddTime}
              handleRemoveTime={handleRemoveTime}
              handleAddDestination={handleAddDestination}
              setNewTimeInputs={setNewTimeInputs}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default BusSection;