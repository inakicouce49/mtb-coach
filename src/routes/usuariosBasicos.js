const { Schema, model } = require('mongoose');

const usuarioBasicoSchema = new Schema({
  email: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  sexo: { type: String, enum: ['M', 'F', 'Otro'], required: true },
  edad: { type: Number, required: true },
  altura: { type: Number, required: true },
  peso: { type: Number, required: true },
  stravaAutorizado: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('UsuarioBasico', usuarioBasicoSchema);
