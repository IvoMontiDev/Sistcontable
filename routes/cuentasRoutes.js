const express = require('express');
const router = express.Router();
const cuentasController = require('../controllers/cuentasController');

// Ruta para crear una nueva cuenta
router.post('/', cuentasController.crearCuenta);

// Ruta para ver el saldo de una cuenta
router.get('/:codigo/saldo', cuentasController.verSaldoCuenta);

// Ruta para ver el balance de todas las cuentas
router.get('/balance', cuentasController.verBalanceCuentas);

// Ruta para obtener todas las cuentas
router.get('/', cuentasController.obtenerCuentas);

module.exports = router;
