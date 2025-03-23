"use client"

import React, { useState } from 'react';
import DataPortalContent from './DataPortalContent';

// Tipo para los distintos campus
type CampusType = 'vina' | 'penalolen' | 'errazuriz' | 'vitacura' | string;
type SchedulesType = {
  [campus: string]: {
    [destination: string]: string[];
  };
};

const DataPortal = () => {
  // Lista de campus disponibles, ahora empieza vacía
  const [campuses, setCampuses] = useState<string[]>([]);
  
  // Inicializar schedules como objeto vacío con estructura anidada para destinos
  const [schedules, setSchedules] = useState<SchedulesType>({});
  
  // Inicializar newTimeInputs como objeto vacío
  const [newTimeInputs, setNewTimeInputs] = useState<{[key: string]: string}>({});
  
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

  const handleAddDestination = (campus: string, destination: string) => {
    if (!destination || destination.trim() === '') {
      alert('Por favor, ingrese un nombre de destino válido.');
      return;
    }
    
    // Agregar el nuevo destino al objeto de schedules
    setSchedules(prev => {
      const campusSchedules = prev[campus] || {};
      
      // Verificar si el destino ya existe
      if (campusSchedules[destination]) {
        alert(`El destino "${destination}" ya existe.`);
        return prev;
      }
      
      return {
        ...prev,
        [campus]: {
          ...campusSchedules,
          [destination]: []
        }
      };
    });
  };

  const handleAddTime = (campus: string, destination: string) => {
    const inputKey = `${campus}-${destination}`;
    if (newTimeInputs[inputKey]) {
      if (isValidTimeFormat(newTimeInputs[inputKey])) {
        setSchedules(prev => {
          const campusSchedules = {...(prev[campus] || {})};
          const destinationTimes = [...(campusSchedules[destination] || [])];
          destinationTimes.push(newTimeInputs[inputKey]);
          
          return {
            ...prev,
            [campus]: {
              ...campusSchedules,
              [destination]: destinationTimes
            }
          };
        });
        
        // Limpiar el input después de agregar
        setNewTimeInputs(prev => ({
          ...prev,
          [inputKey]: ''
        }));
      } else {
        alert('Por favor, ingrese una hora válida en formato HH:MM (por ejemplo, 14:30)');
      }
    }
  };

  const handleRemoveTime = (campus: string, destination: string, index: number) => {
    setSchedules(prev => {
      const campusSchedules = {...(prev[campus] || {})};
      const destinationTimes = [...(campusSchedules[destination] || [])];
      
      destinationTimes.splice(index, 1);
      
      return {
        ...prev,
        [campus]: {
          ...campusSchedules,
          [destination]: destinationTimes
        }
      };
    });
  };
  
  const handleReset = () => {
    // Confirmar que el usuario realmente quiere reiniciar todo
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer.')) {
      // Reiniciar campuses a un array vacío
      setCampuses([]);
      
      // Reiniciar horarios a un objeto vacío
      setSchedules({});
      
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
      
      // Reiniciar inputs de nuevos horarios a un objeto vacío
      setNewTimeInputs({});
    }
  };
  
  // Función para agregar un nuevo campus
  const handleAddCampus = () => {
    // Mostrar un prompt para que el usuario ingrese el nombre del nuevo campus
    const newCampusName = prompt('Ingrese el nombre del nuevo campus:');
    
    // Verificar que se ingresó un nombre válido
    if (newCampusName && newCampusName.trim() !== '') {
      // Normalizar el nombre (convertir a minúsculas y reemplazar espacios)
      const normalizedName = newCampusName.trim().toLowerCase().replace(/\s+/g, '_');
      
      // Verificar que no exista ya un campus con ese nombre
      if (campuses.includes(normalizedName)) {
        alert(`Ya existe un campus con el nombre "${newCampusName}".`);
        return;
      }
      
      // Actualizar la lista de campus
      setCampuses(prev => [...prev, normalizedName]);
      
      // Inicializar el array de horarios para el nuevo campus con destinos predeterminados
      setSchedules(prev => ({
        ...prev,
        [normalizedName]: {
          'sporting': [] // Destino predeterminado 1
        }
      }));
    }
  };
  
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