const express = require('express');
const router = express.Router();
const asientosController = require('../controllers/asientosController');

// Ruta para crear un nuevo asiento
router.post('/', asientosController.crearAsiento);

// Ruta para obtener todos los asientos
router.get('/', asientosController.obtenerAsientos);

// Ruta para modificar un asiento
router.put('/modificar/:id', asientosController.modificarAsiento);

// Ruta para eliminar un asiento
router.delete('/eliminar/:id', asientosController.eliminarAsiento);

module.exports = router;
