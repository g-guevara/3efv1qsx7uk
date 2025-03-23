"use client"

import React from 'react';
import DataPortalContent from './DataPortalContent';
import { useDataHandlers } from './DataHandlers';
import { useCampusHandlers } from './CampusHandlers';

const DataPortal = () => {
  // Usar los custom hooks para manejar el estado y la lógica
  const {
    campuses,
    schedules,
    newTimeInputs,
    uploadedFiles,
    daysOfWeek,
    setCampuses,
    setSchedules,
    setNewTimeInputs,
    handleFileUpload,
    handleFileRemove,
    handleAddDestination,
    handleAddTime,
    handleRemoveTime
  } = useDataHandlers();

  // Usar el hook para manejar las operaciones de campus
  const {
    handleAddCampus,
    handleReset
  } = useCampusHandlers(campuses, setCampuses, setSchedules);
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Portal de inyección de datos a APP Salas UAI</h1>
      
      <DataPortalContent 
        schedules={schedules}
        campuses={campuses}
        newTimeInputs={newTimeInputs}
        uploadedFiles={uploadedFiles}
        daysOfWeek={daysOfWeek}
        handleAddTime={handleAddTime}
        handleRemoveTime={handleRemoveTime}
        handleFileUpload={handleFileUpload}
        handleFileRemove={handleFileRemove}
        handleReset={handleReset}
        handleAddCampus={handleAddCampus}
        handleAddDestination={handleAddDestination}
        setNewTimeInputs={setNewTimeInputs}
      />
      
      <div className="mt-10 text-center">
        <p className="text-gray-600 font-medium">Documentación de la app:</p>
        <a 
          href="https://docs.google.com/spreadsheets/d/17N3zaTh17ln8DFQ3r5ExXnnOeftMSKag2qcB7cZqj9A/edit?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          https://docs.google.com/spreadsheets/d/17N3zaTh17ln8DFQ3r5ExXnnOeftMSKag2qcB7cZqj9A/edit?usp=sharing
        </a>
      </div>
    </div>
  );
};

export default DataPortal;