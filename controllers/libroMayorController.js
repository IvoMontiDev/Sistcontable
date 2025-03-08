const pool = require('../database/conexion');

// Obtener el libro mayor
const obtenerLibroMayor = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM libromayor ORDER BY Fecha');
      
      // Formatear la fecha para devolverla en un formato legible
      const libroConFechaFormateada = rows.map(asiento => ({
        ...asiento,
        Fecha: new Date(asiento.Fecha).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      }));

      res.json(libroConFechaFormateada);
    } catch (error) {
      console.error('Error al obtener el libro mayor:', error);
      res.status(500).json({ message: 'Error al obtener el libro mayor' });
    }
};

module.exports = { obtenerLibroMayor };
