// src/routes/cuentasRoutes.js
const express = require('express');
const { obtenerCuentas } = require('../controllers/cuentasController');

const router = express.Router();

// Ruta para obtener todas las cuentas
router.get('/', obtenerCuentas);

module.exports = router;
