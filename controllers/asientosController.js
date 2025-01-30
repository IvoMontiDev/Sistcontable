const pool = require('../database/conexion');

// Crear un nuevo asiento
const crearAsiento = async (req, res) => {
    const { fecha, descripcion, debe, haber, codigoCuentaDebe, codigoCuentaHaber } = req.body;
  
    try {
      // Registrar el asiento original
      await pool.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?)', [
        fecha,
        descripcion,
        debe,
        haber,
        codigoCuentaDebe,
        codigoCuentaHaber
      ]);
  
    //   // Registrar el asiento contraparte
    //   await pool.query('CALL GenerarAsiento(?, ?, ?, ?, ?, ?)', [
    //     fecha,
    //     `Contraparte: ${descripcion}`, // Descripción del asiento contraparte
    //     haber, // El haber se convierte en el debe del asiento contraparte
    //     debe,  // El debe se convierte en el haber del asiento contraparte
    //     codigoCuentaHaber, // Código de la cuenta que ahora será el debe
    //     codigoCuentaDebe // Código de la cuenta que ahora será el haber
    //   ]);
  
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


// Método para modificar un asiento
const modificarAsiento = async (req, res) => {
    const { id } = req.params;
    const { Fecha, Descripcion, Debe, Haber, Codigo_Cuenta_Debe, Codigo_Cuenta_Haber } = req.body;
  
    // Convierte la fecha al formato que espera la base de datos (opcional, depende de la DB)
    const fechaFormateada = new Date(Fecha).toISOString().split('T')[0];
  
    try {
      const [result] = await pool.query(
        'UPDATE Asientos SET Fecha = ?, Descripcion = ?, Debe = ?, Haber = ?, Codigo_Cuenta_Debe = ?, Codigo_Cuenta_Haber = ? WHERE ID_asiento = ?',
        [fechaFormateada, Descripcion, Debe, Haber, Codigo_Cuenta_Debe, Codigo_Cuenta_Haber, id]
      );
      res.json({ message: 'Asiento actualizado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el asiento' });
    }
  };
  
  
  // Método para eliminar un asiento

const eliminarAsiento = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Llamada al Stored Procedure para eliminar en cascada
      await pool.query('CALL EliminarAsientoConRelacion(?)', [id]);
  
      res.json({ message: 'Asiento eliminado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el asiento' });
    }
  };
  


module.exports = {
  crearAsiento,
  obtenerAsientos,
  modificarAsiento,
  eliminarAsiento,
};
