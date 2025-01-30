const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const asientosRoutes = require('./routes/asientosRoutes');
const cuentasRoutes = require('./routes/cuentasRoutes');
const libroMayorRoutes = require('./routes/libroMayorRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/asientos', asientosRoutes);
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/libroMayor', libroMayorRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
