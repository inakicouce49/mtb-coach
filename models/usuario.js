const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  stravaId: Number,
  accessToken: String,
  refreshToken: String,
  tokenExpira: Date
});

module.exports = mongoose.model('Usuario', usuarioSchema);
