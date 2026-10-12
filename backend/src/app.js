const express = require('express');
const cors = require('cors');
const { calcularTarifa } = require('./cotizador');

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/cotizar  { peso, tipoCliente, tipoEnvio }
app.post('/api/cotizar', (req, res) => {
  const { peso, tipoCliente, tipoEnvio } = req.body || {};
  try {
    const resultado = calcularTarifa(Number(peso), tipoCliente, tipoEnvio);
    res.status(200).json(resultado);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = app;
