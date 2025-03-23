import { useState } from 'react';

// Tipos
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

export const useDataHandlers = () => {
  // Lista de campus disponibles, ahora empieza vacía
  const [campuses, setCampuses] = useState<string[]>([]);
  
  // Inicializar schedules como objeto vacío con estructura anidada para destinos
  const [schedules, setSchedules] = useState<SchedulesType>({});
  
  // Inicializar newTimeInputs como objeto vacío
  const [newTimeInputs, setNewTimeInputs] = useState<{[key: string]: string}>({});
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({
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
          [destination]: {
            Subida: [],
            Regreso: []
          }
        }
      };
    });
  };

  const handleAddTime = (campus: string, destination: string, busType: BusType) => {
    const inputKey = `${campus}-${destination}-${busType}`;
    if (newTimeInputs[inputKey]) {
      if (isValidTimeFormat(newTimeInputs[inputKey])) {
        setSchedules(prev => {
          const campusSchedules = {...(prev[campus] || {})};
          const destinationSchedules = {...(campusSchedules[destination] || { Subida: [], Regreso: [] })};
          const busTypeSchedules = [...(destinationSchedules[busType] || [])];
          
          busTypeSchedules.push(newTimeInputs[inputKey]);
          
          return {
            ...prev,
            [campus]: {
              ...campusSchedules,
              [destination]: {
                ...destinationSchedules,
                [busType]: busTypeSchedules
              }
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

  const handleRemoveTime = (campus: string, destination: string, busType: BusType, index: number) => {
    setSchedules(prev => {
      const campusSchedules = {...(prev[campus] || {})};
      const destinationSchedules = {...(campusSchedules[destination] || { Subida: [], Regreso: [] })};
      const busTypeSchedules = [...(destinationSchedules[busType] || [])];
      
      busTypeSchedules.splice(index, 1);
      
      return {
        ...prev,
        [campus]: {
          ...campusSchedules,
          [destination]: {
            ...destinationSchedules,
            [busType]: busTypeSchedules
          }
        }
      };
    });
  };
  
  return {
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
  };
};

export default useDataHandlers;