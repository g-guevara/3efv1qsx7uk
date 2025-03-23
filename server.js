// RUTA PARA ELIMINAR UN HORARIO DE BUS ESPECÍFICO
app.delete("/buses/:id", async (req, res) => {
  try {
    const busId = req.params.id;
    
    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ error: "ID de bus inválido" });
    }
    
    // Buscar y eliminar el bus por su ID
    const deletedBus = await Bus.findByIdAndDelete(busId);
    
    if (!deletedBus) {
      return res.status(404).json({ error: "Bus no encontrado" });
    }
    
    res.status(200).json({ message: "Bus eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar bus:", err);
    res.status(500).json({ error: "Error al eliminar el horario de bus" });
  }
});

// RUTA DE PRUEBA PARA VER SI EL SERVIDOR ESTÁ FUNCIONANDO
app.get("/", (req, res) => {
  res.send("Servidor funcionando en Vercel 🚀");
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Agregar esta ruta a tu archivo server.js

// RUTA PARA ELIMINAR UN HORARIO DE BUS POR ID
app.delete("/buses/:id", async (req, res) => {
  try {
    const busId = req.params.id;
    
    // Verificar que el ID es válido
    if (!busId) {
      return res.status(400).json({ error: "ID del bus requerido" });
    }
    
    // Buscar y eliminar el bus con el ID proporcionado
    const deletedBus = await Bus.findByIdAndDelete(busId);
    
    if (!deletedBus) {
      return res.status(404).json({ error: "No se encontró horario con ese ID" });
    }
    
    res.status(200).json({ message: "Horario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar horario de bus:", err);
    res.status(500).json({ error: "Error al eliminar el horario de bus" });
  }
});