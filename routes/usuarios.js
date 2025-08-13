console.log('📦 Usuarios.js está vivo');
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

console.log('✅ Ruta /usuarios cargada');

// 🔹 Ruta de prueba
router.get('/ping', (req, res) => {
  res.send('🏓 Pong desde /usuarios');
});

// 🔹 Crear usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, stravaId, accessToken, refreshToken } = req.body;

    if (!nombre || !email || !stravaId || !accessToken || !refreshToken) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({
      $or: [{ email }, { stravaId }]
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: 'El usuario ya existe con ese email o Strava ID' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      stravaId,
      accessToken,
      refreshToken,
      tokenExpira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
    });

    await nuevoUsuario.save();
    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
