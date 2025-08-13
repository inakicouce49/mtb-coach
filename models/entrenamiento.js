const mongoose = require('mongoose');

const entrenamientoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    enum: ['trail', 'enduro', 'descenso', 'ruta'],
    required: true
  },
  notas: {
    type: String
  }
});

const Entrenamiento = mongoose.model('Entrenamiento', entrenamientoSchema);

module.exports = Entrenamiento;
