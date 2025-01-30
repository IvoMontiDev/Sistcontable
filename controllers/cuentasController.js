// src/controllers/cuentasController.js
const pool = require('../database/conexion'); // Asegúrate de que la conexión esté bien configurada

// Obtener todas las cuentas
const obtenerCuentas = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Cuentas');
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las cuentas' });
  }
};

module.exports = {
  obtenerCuentas,
};
