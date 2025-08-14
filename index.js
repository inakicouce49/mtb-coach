// 1. Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Importar routers apuntando a la carpeta correcta
const stravaRoutes          = require('./routes/strava');
const usuariosRoutes        = require('./routes/usuarios');
const entrenamientosRoutes  = require('./routes/entrenamientos');

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Montar rutas
app.use('/strava', stravaRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/entrenamientos', entrenamientosRoutes);

// 5. Conectar a MongoDB sin imprimir la contraseña
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_HOST,
  MONGO_DB
} = process.env;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}` +
            `@${MONGO_HOST}/${MONGO_DB}`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Mostramos sólo host y base, nunca la contraseña
    console.log(`✔️  MongoDB conectada a ${MONGO_HOST}/${MONGO_DB}`);
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });

// 6. Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
});
