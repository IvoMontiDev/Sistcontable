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


const crearMultiplesAsientos = async (req, res) => {
    const { asientos } = req.body;

    if (!Array.isArray(asientos) || asientos.length === 0) {
        return res.status(400).json({ message: 'Debe proporcionar un array de asientos' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (let i = 0; i < asientos.length; i++) {
            const { fecha, descripcion, debe, haber, codigoCuentaDebe, codigoCuentaHaber, impuesto } = asientos[i];

            // Validación para asegurarse de que solo se usan dos cuentas
            if (!codigoCuentaDebe || !codigoCuentaHaber) {
                return res.status(400).json({ message: 'Debe y Haber deben ser de dos cuentas diferentes.' });
            }

            // Calcular el impuesto (si es necesario)
            const impuestoCalculado = impuesto || 0; // Si no se pasa impuesto, es 0

            // Registrar el asiento principal
            await connection.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?, ?)', [
                fecha,
                descripcion,
                debe,
                haber,
                codigoCuentaDebe,
                codigoCuentaHaber,
                impuestoCalculado
            ]);

            // Registrar el asiento contraparte
            await connection.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?, ?)', [
                fecha,
                `Contraparte: ${descripcion}`,
                haber,
                debe,
                codigoCuentaHaber,
                codigoCuentaDebe,
                impuestoCalculado
            ]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Asientos creados con éxito' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error al crear los asientos' });
    } finally {
        connection.release();
    }
};


module.exports = {
    crearAsiento,
    obtenerAsientos,
    crearMultiplesAsientos
};
