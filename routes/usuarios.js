const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

console.log('✅ Ruta /usuarios cargada');

// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error('❌ Error al crear usuario:', err);
    res.status(400).json({ error: 'Datos inválidos' });
  }
});

module.exports = router;
