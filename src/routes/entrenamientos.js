const express = require('express');
const router = express.Router();
const Entrenamiento = require('../models/entrenamiento');

console.log('✅ Ruta /entrenamientos cargada');

// Crear un nuevo entrenamiento
router.post('/', async (req, res) => {
  try {
    const { usuarioId, fecha, duracion, tipo, notas } = req.body;

    if (!usuarioId || !fecha || !duracion || !tipo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoEntreno = new Entrenamiento({
      usuarioId,
      fecha: new Date(fecha),
      duracion,
      tipo,
      notas
    });

    await nuevoEntreno.save();
    res.status(201).json({
      mensaje: 'Entrenamiento creado correctamente',
      entrenamiento: nuevoEntreno
    });
  } catch (error) {
    console.error('❌ Error al crear entrenamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los entrenamientos
router.get('/', async (req, res) => {
  try {
    const entrenos = await Entrenamiento.find()
      .populate('usuarioId', 'nombre email');
    res.json(entrenos);
  } catch (error) {
    console.error('❌ Error al obtener entrenamientos:', error);
    res.status(500).json({ error: 'Error al obtener entrenamientos' });
  }
});

module.exports = router;
