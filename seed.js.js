// seed.js — Poblar la base de datos con datos iniciales
require('dotenv').config();

const mongoose = require('mongoose');
const Usuario = require('./models/usuario');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mtb-coach';
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Conectado a MongoDB para seed');

    // Lista de usuarios de ejemplo
    const usuariosIniciales = [
      {
        nombre: 'Jose',
        email: 'jose@example.com',
        stravaId: 12345678,
        accessToken: 'token_de_prueba',
        refreshToken: 'refresh_de_prueba',
        tokenExpira: new Date(Date.now() + 3600 * 1000)
      }
      // Puedes añadir más objetos aquí
    ];

    for (const data of usuariosIniciales) {
      const u = new Usuario(data);
      await u.save();
      console.log(`🎉 Usuario ${data.nombre} creado correctamente`);
    }

    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error al ejecutar seed:', err);
    process.exit(1);
  });
