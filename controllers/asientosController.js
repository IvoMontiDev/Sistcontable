const pool = require('../database/conexion');

// Crear un nuevo asiento
const crearAsiento = async (req, res) => {
    const { fecha, descripcion, debe, haber, codigoCuentaDebe, codigoCuentaHaber, impuesto } = req.body;

    try {
        // Validación para asegurarse de que solo se usan dos cuentas
        if (!codigoCuentaDebe || !codigoCuentaHaber) {
            return res.status(400).json({ message: 'Debe y Haber deben ser de dos cuentas diferentes.' });
        }

        // Calcular el impuesto (si es necesario)
        const impuestoCalculado = impuesto || 0; // Si no se pasa impuesto, es 0
        await pool.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?, ?)', [
            fecha,
            descripcion,
            debe,
            haber,
            codigoCuentaDebe,
            codigoCuentaHaber,
            impuesto
        ]);
        

        // Registrar el asiento contraparte
        await pool.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?)', [
            fecha,
            `Contraparte: ${descripcion}`, // Descripción del asiento contraparte
            haber, // El haber se convierte en el debe del asiento contraparte
            debe,  // El debe se convierte en el haber del asiento contraparte
            codigoCuentaHaber, // Código de la cuenta que ahora será el debe
            codigoCuentaDebe // Código de la cuenta que ahora será el haber
        ]);

        res.status(201).json({ message: 'Asiento creado con éxito, incluyendo contraparte' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el asiento' });
    }
};

// Obtener todos los asientos (libro diario)
const obtenerAsientos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Asientos ORDER BY Fecha');

        // Mapea los resultados para dar formato a la fecha antes de enviarlos al frontend
        const asientosConFechaFormateada = rows.map(asiento => ({
            ...asiento,
            Fecha: new Date(asiento.Fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }));

        res.json(asientosConFechaFormateada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los asientos' });
    }
};


// Método para crear múltiples asientos (desdoblado)
const crearMultiplesAsientos = async (req, res) => {
    const { asientos } = req.body;

    if (!Array.isArray(asientos) || asientos.length === 0) {
        return res.status(400).json({ message: 'Debe proporcionar un array de asientos' });
    }

    try {
        for (let i = 0; i < asientos.length; i++) {
            const { fecha, descripcion, debe, haber, codigoCuentaDebe, codigoCuentaHaber } = asientos[i];

            // Validación para asegurarse de que solo se usan dos cuentas
            if (!codigoCuentaDebe || !codigoCuentaHaber) {
                return res.status(400).json({ message: 'Debe y Haber deben ser de dos cuentas diferentes.' });
            }

            // Registrar cada asiento de manera individual
            await pool.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?)', [
                fecha,
                descripcion,
                debe,
                haber,
                codigoCuentaDebe,
                codigoCuentaHaber
            ]);

            // Registrar el asiento contraparte para cada asiento
            await pool.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?)', [
                fecha,
                `Contraparte: ${descripcion}`,
                haber,
                debe,
                codigoCuentaHaber,
                codigoCuentaDebe
            ]);
        }

        res.status(201).json({ message: 'Asientos creados con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear los asientos' });
    }
};

module.exports = {
    crearAsiento,
    obtenerAsientos,
    crearMultiplesAsientos
};
