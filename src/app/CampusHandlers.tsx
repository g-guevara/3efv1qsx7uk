import { useState } from 'react';

// Definimos los tipos necesarios
type SchedulesType = {
  [campus: string]: {
    [destination: string]: {
      Subida: string[];
      Regreso: string[];
    };
  };
};

// Función para agregar un nuevo campus
export const useCampusHandlers = (
  campuses: string[],
  setCampuses: React.Dispatch<React.SetStateAction<string[]>>,
  setSchedules: React.Dispatch<React.SetStateAction<SchedulesType>>
) => {
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
      setCampuses((prev: string[]) => [...prev, normalizedName]);
      
      // Inicializar el array de horarios para el nuevo campus sin destinos predeterminados
      setSchedules((prev: SchedulesType) => ({
        ...prev,
        [normalizedName]: {}
      }));
    }
  };

  // Función para reiniciar todos los datos
  const handleReset = () => {
    // Confirmar que el usuario realmente quiere reiniciar todo
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer.')) {
      // Reiniciar campuses a un array vacío
      setCampuses([]);
      
      // Reiniciar horarios a un objeto vacío
      setSchedules({});
      
      return true;
    }
    
    return false;
  };
  
  return {
    handleAddCampus,
    handleReset
  };
};

export default useCampusHandlers;