const mongoose = require('mongoose');
const Usuario = require('./models/usuario'); // ✅ Ruta corregida

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mtb-coach', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Conectado a MongoDB');
}).catch(err => {
  console.error('❌ Error de conexión:', err);
});

// Crear tu usuario
const nuevoUsuario = new Usuario({
  nombre: 'Jose',
  email: 'jose@example.com',
  stravaId: 12345678,
  accessToken: 'token_de_prueba',
  refreshToken: 'refresh_de_prueba',
  tokenExpira: new Date(Date.now() + 3600 * 1000) // 1 hora desde ahora
});

// Guardar en la base de datos
nuevoUsuario.save().then(() => {
  console.log('🎉 Usuario creado correctamente');
  mongoose.connection.close();
}).catch(err => {
  console.error('❌ Error al crear usuario:', err);
});
