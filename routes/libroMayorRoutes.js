const express = require('express');
const router = express.Router();
const libroMayorController = require('../controllers/libroMayorController');

// Endpoint para obtener el libro mayor
router.get('/', libroMayorController.obtenerLibroMayor);

module.exports = router;
