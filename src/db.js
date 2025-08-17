// src/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`✔️ MongoDB conectada`))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err.message));

module.exports = mongoose;
