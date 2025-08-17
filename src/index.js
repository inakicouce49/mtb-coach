// src/index.js

// 1. Cargar variables de entorno
require('dotenv').config();

// 2. Conectar a MongoDB (extraído a db.js)
require('./db');

// 3. Importar dependencias
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 4. Importar routers
const stravaRoutes = require('./routes/strava');
const usuariosRoutes = require('./routes/usuarios');
const entrenamientosRoutes = require('./routes/entrenamientos');

const app = express();

// 5. Middlewares globales
app.use(helmet());                              // Seguridad HTTP headers
app.use(cors({                                  // Configurar CORS
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());                        // Parsear JSON bodies
app.use(morgan('dev'));                         // Logging de peticiones

// 6. Montar rutas de la API con prefijo /api
app.use('/api/strava', stravaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/entrenamientos', entrenamientosRoutes);

// 7. Ruta raíz para comprobar servidor
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente!');
});

// 8. Manejar 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// 9. Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Error interno del servidor' });
});

// 10. Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
