const express = require('express');
const router = express.Router();
const asientosController = require('../controllers/asientosController');

// Ruta para crear un nuevo asiento
router.post('/', asientosController.crearAsiento);

// Ruta para obtener todos los asientos
router.get('/', asientosController.obtenerAsientos);


// Agregar ruta para crear múltiples asientos
router.post('/multiples', asientosController.crearMultiplesAsientos);


module.exports = router;
