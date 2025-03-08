const pool = require('../database/conexion');

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

// Crear una nueva cuenta
const crearCuenta = async (req, res) => {
    const { codigo, nombre, tipo, saldoInicial } = req.body;

    try {
        // Validar si ya existe una cuenta con el mismo código
        const [rows] = await pool.query('SELECT * FROM Cuentas WHERE codigo = ?', [codigo]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe una cuenta con este código' });
        }

        // Insertar la nueva cuenta
        await pool.query('INSERT INTO Cuentas (codigo, nombre, tipo, saldo) VALUES (?, ?, ?, ?)', [
            codigo,
            nombre,
            tipo,
            saldoInicial || 0
        ]);

        res.status(201).json({ message: 'Cuenta creada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la cuenta' });
    }
};

// Ver el saldo de una cuenta
const verSaldoCuenta = async (req, res) => {
    const { codigo } = req.params;

    try {
        // Obtener el saldo de la cuenta
        const [rows] = await pool.query('SELECT Saldo FROM cuentas WHERE codigo = ?', [codigo]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        }

        res.json({ saldo: rows[0].saldo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el saldo de la cuenta' });
    }
};

// Ver el balance de todas las cuentas
const verBalanceCuentas = async (req, res) => {
    try {
        // Obtener el saldo de todas las cuentas
        const [rows] = await pool.query('SELECT Codigo_Cuenta, Nombre, Saldo FROM cuentas');

        // Si no hay cuentas registradas
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron cuentas registradas' });
        }

        res.json({ balance: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el balance de las cuentas' });
    }
};



module.exports = {
    crearCuenta,
    obtenerCuentas,
    verSaldoCuenta,
    verBalanceCuentas
};
