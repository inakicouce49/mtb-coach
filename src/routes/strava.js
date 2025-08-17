// src/routes/strava.js

const express = require('express');
const axios = require('axios');
const Usuario = require('../models/usuario');

const router = express.Router();
const OAUTH_TOKEN_URL = 'https://www.strava.com/oauth/token';
const API_BASE_URL = 'https://www.strava.com/api/v3';

console.log('📦 strava.js cargado');

// Health check
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Exchange authorization code for tokens
router.get('/exchange_token', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Falta el parámetro "code"' });
  }

  try {
    const { data } = await axios.post(OAUTH_TOKEN_URL, {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_at, athlete } = data;

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
      usuario.accessToken  = access_token;
      usuario.refreshToken = refresh_token;
      usuario.tokenExpira  = new Date(expires_at * 1000);
    }
    await usuario.save();

    res.json({
      mensaje: 'Usuario conectado y guardado',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        stravaId: usuario.stravaId,
        tokenExpira: usuario.tokenExpira
      }
    });
  } catch (err) {
    console.error('❌ Error en exchange_token:', err.response?.data || err.message);
    res.status(500).json({ error: 'No se pudo obtener tokens de Strava' });
  }
});

// Refresh access token when expired
router.post('/refresh_token', async (req, res) => {
  const { stravaId } = req.body;
  if (!stravaId) {
    return res.status(400).json({ error: 'Falta "stravaId" en body' });
  }

  try {
    const usuario = await Usuario.findOne({ stravaId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no registrado' });
    }

    const now = Date.now();
    if (usuario.tokenExpira > now) {
      return res.json({
        mensaje: 'Token aún válido',
        accessToken: usuario.accessToken,
        expiresAt: usuario.tokenExpira
      });
    }

    const { data } = await axios.post(OAUTH_TOKEN_URL, {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: usuario.refreshToken
    });

    usuario.accessToken  = data.access_token;
    usuario.refreshToken = data.refresh_token;
    usuario.tokenExpira  = new Date(data.expires_at * 1000);
    await usuario.save();

    res.json({
      mensaje: 'Token refrescado',
      accessToken: usuario.accessToken,
      expiresAt: usuario.tokenExpira
    });
  } catch (err) {
    console.error('❌ Error en refresh_token:', err.response?.data || err.message);
    res.status(500).json({ error: 'No se pudo refrescar el token' });
  }
});

// Listar actividades recientes
router.get('/activities', async (req, res) => {
  const { stravaId, per_page = 10 } = req.query;
  if (!stravaId) {
    return res.status(400).json({ error: 'Falta "stravaId" en query' });
  }

  try {
    const usuario = await Usuario.findOne({ stravaId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no registrado' });
    }

    const response = await axios.get(`${API_BASE_URL}/athlete/activities`, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
      params: { per_page }
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al obtener actividades:', err.response?.data || err.message);
    res.status(500).json({ error: 'No se pudieron cargar actividades' });
  }
});

// Obtener datos del atleta conectado
router.get('/athlete', async (req, res) => {
  const { stravaId } = req.query;
  if (!stravaId) {
    return res.status(400).json({ error: 'Falta "stravaId" en query' });
  }

  try {
    const usuario = await Usuario.findOne({ stravaId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no registrado' });
    }

    const response = await axios.get(`${API_BASE_URL}/athlete`, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` }
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al obtener datos del atleta:', err.response?.data || err.message);
    res.status(500).json({ error: 'No se pudieron cargar datos del atleta' });
  }
});

module.exports = router;
