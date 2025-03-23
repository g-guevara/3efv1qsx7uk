// Servicio para manejar las llamadas a la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Interfaz para los buses
export interface BusData {
  _id?: string;
  Tipo: string;
  Evento: string; // Siempre "Buses"
  Fecha: string;
  Inicio: string;
  Fin: string;
  Sala: string; // Aquí guardaremos el destino (Dominicos, Grecia, etc.)
  Edificio: string;
  Campus: string; // Campus de origen
  Ciudad?: string; // Nueva propiedad para indicar la ciudad del campus
  fechaActualizacion: string;
}

// Interfaz para eventos del Excel
export interface EventData {
  Tipo: string;
  Evento: string;
  Fecha: string;
  Inicio: string;
  Fin: string;
  Sala: string;
  Edificio: string;
  Campus: string;
  Ciudad?: string; // Nueva propiedad para la ciudad del campus
  fechaActualizacion: string;
  diaSemana: string; // El día de la semana en que se subió
}

// Función para enviar datos de buses a MongoDB
export const saveBusSchedule = async (busData: BusData): Promise<BusData> => {
  try {
    // Aseguramos que Evento siempre sea "Buses"
    const dataToSend = {
      ...busData,
      Evento: "Buses"
    };
    
    const response = await fetch(`${API_URL}/buses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error guardando horario de bus:', error);
    throw error;
  }
};

// Función para enviar datos de eventos del Excel a MongoDB
export const saveEvents = async (events: EventData[]): Promise<EventData[]> => {
  try {
    const response = await fetch(`${API_URL}/events/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error guardando eventos:', error);
    throw error;
  }
};

// Función para procesar archivos Excel
export const processExcelFile = async (file: File, diaSemana: string): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('diaSemana', diaSemana);

    const response = await fetch(`${API_URL}/process-excel`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Archivo procesado correctamente:', result);
  } catch (error) {
    console.error('Error procesando archivo Excel:', error);
    throw error;
  }
};

// Función para reiniciar todos los datos
export const resetAllData = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/reset`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Datos reiniciados correctamente:', result);
  } catch (error) {
    console.error('Error reiniciando datos:', error);
    throw error;
  }
};