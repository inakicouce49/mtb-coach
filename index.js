// 📦 Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors'); // ✅ Añadido para permitir peticiones externas
const mongoose = require('mongoose');
const usuariosRoutes = require('./routes/usuarios');
const entrenamientosRoutes = require('./routes/entrenamientos');
const stravaRoutes = require('./routes/strava');

const app = express(); // 👈 Inicialización de Express

app.use(cors()); // ✅ Activación de CORS
app.use(express.json()); // ✅ Middleware para parsear JSON

// 📂 Rutas organizadas por funcionalidad
app.use('/strava', stravaRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/entrenamientos', entrenamientosRoutes);

// 🔍 Verificar que la URI se está leyendo
console.log('🔍 URI de Mongo:', process.env.MONGO_URI);

// 🌐 Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
})
.catch(err => {
  console.error('❌ Error de conexión con MongoDB Atlas:', err);
});

// 🛣️ Mostrar rutas activas del servidor principal
console.log('\n📍 Rutas registradas directamente en app:');
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
    console.log(`🛣️ [${methods}] ${r.route.path}`);
  }
});

// 🛣️ Mostrar rutas activas de cada router externo
const listRoutes = (router, prefix = '') => {
  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      const path = prefix + layer.route.path;
      console.log(`🛣️ [${methods}] ${path}`);
    }
  });
};

console.log('\n📍 Rutas en stravaRoutes:');
listRoutes(stravaRoutes, '/strava');

console.log('\n📍 Rutas en usuariosRoutes:');
listRoutes(usuariosRoutes, '/usuarios');

console.log('\n📍 Rutas en entrenamientosRoutes:');
listRoutes(entrenamientosRoutes, '/entrenamientos');

// 🚀 Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
});
