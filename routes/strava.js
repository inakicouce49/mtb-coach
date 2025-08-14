// 📦 strava.js cargado
console.log('📦 strava.js cargado');

const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🩺 Ruta de prueba para verificar que el módulo está activo
router.get('/ping', (req, res) => {
  res.send('pong');
});

// 🔄 Ruta para intercambiar el código de autorización por un token de acceso
router.get('/exchange_token', async (req, res) => {
  const code = req.query.code;

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

    const { access_token, refresh_token, athlete } = response.data;

    console.log('✅ Access Token:', access_token);
    console.log('🏃‍♂️ Usuario Strava:', athlete.firstname, athlete.lastname);

    // Puedes guardar el token en MongoDB si quieres persistencia
    res.redirect(`/sync?token=${access_token}`);
  } catch (error) {
    console.error('❌ Error al intercambiar token:', error.response?.data || error.message);
    res.status(500).send('Error al obtener el token');
  }
});

module.exports = router;

