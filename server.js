require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración para subir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI, {
  dbName: "uai-salas", // Asegura que esté conectando a la base de datos correcta
});

// Schema para eventos existente
const EventoSchema = new mongoose.Schema({
  Tipo: String,
  Evento: String,
  Fecha: String,
  Inicio: String,
  Fin: String,
  Sala: String,
  Edificio: String,
  Campus: String,
  Ciudad: String, // Campo opcional para ciudad
  fechaActualizacion: String,
  diaSemana: String // Agregado para asociar el día de la semana
});  

// Schema para buses (modificado)
const BusSchema = new mongoose.Schema({
  Tipo: {
    type: String,
    default: "Buses"
  },
  Evento: {
    type: String,
    default: "Buses"
  },
  Fecha: String,
  Inicio: String,
  Fin: String,
  Sala: String, // El destino (Dominicos, Grecia, etc.)
  Edificio: {
    type: String,
    default: "paradero"
  },
  Campus: String, // El campus de origen
  Ciudad: String, // Campo opcional para la ciudad
  fechaActualizacion: String
});

const Evento = mongoose.model("Evento", EventoSchema, "eventos");
const Bus = mongoose.model("Bus", BusSchema, "all_buses");
const AllEvent = mongoose.model("AllEvent", EventoSchema, "all_events");

// RUTA PARA OBTENER EVENTOS
app.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos" });
  }
});

// RUTA PARA GUARDAR HORARIOS DE BUSES
app.post("/buses", async (req, res) => {
  try {
    const busData = req.body;
    // Asegurarse de que Evento siempre sea "Buses"
    busData.Evento = "Buses";
    
    const newBus = new Bus(busData);
    await newBus.save();
    res.status(201).json(newBus);
  } catch (err) {
    console.error("Error al guardar bus:", err);
    res.status(500).json({ error: "Error al guardar el horario de bus" });
  }
});

// RUTA PARA GUARDAR MÚLTIPLES EVENTOS
app.post("/events/batch", async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: "Se esperaba un array de eventos" });
    }

    const savedEvents = await AllEvent.insertMany(events);
    res.status(201).json(savedEvents);
  } catch (err) {
    console.error("Error al guardar eventos:", err);
    res.status(500).json({ error: "Error al guardar eventos" });
  }
});

// RUTA PARA OBTENER HORARIOS DE BUSES POR CAMPUS Y DESTINO
app.get("/buses/:campus", async (req, res) => {
  try {
    const campus = req.params.campus;
    const buses = await Bus.find({ Campus: campus });
    
    // Agrupar buses por destino
    const busesByDestination = {};
    
    buses.forEach(bus => {
      const destino = bus.Sala;
      if (!busesByDestination[destino]) {
        busesByDestination[destino] = [];
      }
      busesByDestination[destino].push({
        id: bus._id,
        hora: bus.Inicio,
        fecha: bus.Fecha
      });
    });
    
    res.json(busesByDestination);
  } catch (err) {
    console.error("Error al obtener horarios de buses:", err);
    res.status(500).json({ error: "Error al obtener los horarios de buses" });
  }
});

// RUTA PARA PROCESAR ARCHIVOS EXCEL
app.post("/process-excel", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se proporcionó un archivo" });
    }

    const diaSemana = req.body.diaSemana;
    
    if (!diaSemana) {
      return res.status(400).json({ error: "El día de la semana es obligatorio" });
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Formatear los datos para la base de datos
    const events = data.map(row => ({
      Tipo: row.Tipo || '',
      Evento: row.Evento || '',
      Fecha: row.Fecha || '',
      Inicio: row.Inicio || '',
      Fin: row.Fin || '',
      Sala: row.Sala || '',
      Edificio: row.Edificio || '',
      Campus: row.Campus || '',
      Ciudad: row.Ciudad || '', // Incluir el campo Ciudad si existe
      fechaActualizacion: new Date().toISOString(),
      diaSemana: diaSemana
    }));

    // Guardar todos los eventos
    const savedEvents = await AllEvent.insertMany(events);

    res.status(201).json({
      message: "Archivo procesado con éxito",
      eventsCount: savedEvents.length
    });
  } catch (err) {
    console.error("Error procesando archivo Excel:", err);
    res.status(500).json({ error: "Error al procesar el archivo Excel" });
  }
});

// RUTA PARA ELIMINAR TODOS LOS DATOS (REINICIO)
app.delete("/reset", async (req, res) => {
  try {
    // Eliminar todos los buses
    await Bus.deleteMany({});
    
    // Eliminar todos los eventos
    await AllEvent.deleteMany({});
    
    res.status(200).json({ message: "Todos los datos han sido eliminados correctamente" });
  } catch (err) {
    console.error("Error al reiniciar datos:", err);
    res.status(500).json({ error: "Error al eliminar los datos" });
  }
});

// RUTA DE PRUEBA PARA VER SI EL SERVIDOR ESTÁ FUNCIONANDO
app.get("/", (req, res) => {
  res.send("Servidor funcionando en Vercel 🚀");
});