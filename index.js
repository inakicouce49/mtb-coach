const express = require('express');
const mongoose = require('mongoose');
const usuariosRoutes = require('./routes/usuarios');
const entrenamientosRoutes = require('./routes/entrenamientos');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mtb-coach', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Conectado a MongoDB');
}).catch(err => {
  console.error('❌ Error de conexión:', err);
});

app.use('/usuarios', usuariosRoutes);
app.use('/entrenamientos', entrenamientosRoutes);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
});

