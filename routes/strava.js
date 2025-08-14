const express = require('express');
const axios = require('axios');
const Usuario = require('../models/usuario');
const router = express.Router();

console.log('📦 strava.js cargado');

// Ruta de prueba para verificar que el módulo está activo
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Intercambiar el código de autorización por tokens
router.get('/exchange_token', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Falta el parámetro "code"');
  }

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_at, athlete } = response.data;

    // Guardar o actualizar el usuario en MongoDB
    let usuario = await Usuario.findOne({ stravaId: athlete.id });
    if (!usuario) {
      usuario = new Usuario({
        nombre: athlete.firstname,
        email: athlete.email,
        stravaId: athlete.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpira: new Date(expires_at * 1000)
      });
    } else {
      usuario.accessToken = access_token;
      usuario.refreshToken = refresh_token;
      usuario.tokenExpira = new Date(expires_at * 1000);
    }
    await usuario.save();

    res.json({ mensaje: 'Usuario conectado y guardado', usuario });
  } catch (error) {
    console.error(
      '❌ Error al intercambiar token:',
      error.response?.data || error.message
    );
    res.status(500).send('Error al obtener el token de Strava');
  }
});

module.exports = router;
