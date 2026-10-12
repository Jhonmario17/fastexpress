<script setup>
import { ref } from 'vue';

const peso = ref('');
const tipoCliente = ref('NUEVO');
const tipoEnvio = ref('ESTANDAR');
const resultado = ref(null);
const error = ref('');

// Validación básica en el cliente (rol Frontend)
function validar() {
  const p = Number(peso.value);
  if (peso.value === '' || Number.isNaN(p)) return 'Ingresa un peso numérico';
  if (p < 0.01) return 'El peso mínimo es 0.01 kg';
  if (p > 20) return 'El peso máximo es 20 kg';
  return '';
}

async function cotizar() {
  resultado.value = null;
  error.value = validar();
  if (error.value) return;
  try {
    const r = await fetch('/api/cotizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ peso: Number(peso.value), tipoCliente: tipoCliente.value, tipoEnvio: tipoEnvio.value }),
    });
    const data = await r.json();
    if (!r.ok) error.value = data.error;
    else resultado.value = data;
  } catch {
    error.value = 'No se pudo conectar con el servidor';
  }
}
</script>

<template>
  <main class="card">
    <h1>📦 FastExpress</h1>
    <p class="sub">Cotizador de envíos</p>

    <label>Peso (kg)
      <input id="peso" v-model="peso" type="number" step="0.01" placeholder="Ej: 3.50" />
    </label>
    <label>Tipo de cliente
      <select id="cliente" v-model="tipoCliente">
        <option>NUEVO</option><option>FRECUENTE</option><option>VIP</option>
      </select>
    </label>
    <label>Tipo de envío
      <select id="envio" v-model="tipoEnvio">
        <option>ESTANDAR</option><option>EXPRESS</option>
      </select>
    </label>
    <button @click="cotizar">Cotizar</button>

    <p v-if="error" class="error" id="error">{{ error }}</p>

    <table v-if="resultado" id="resultado">
      <tbody>
        <tr><td>Tarifa base</td><td>${{ resultado.tarifaBase.toFixed(2) }}</td></tr>
        <tr><td>Costo por peso</td><td>${{ resultado.costoPeso.toFixed(2) }}</td></tr>
        <tr><td>Subtotal</td><td>${{ resultado.subtotal.toFixed(2) }}</td></tr>
        <tr><td>Descuento</td><td>{{ resultado.descuento * 100 }}%</td></tr>
        <tr><td>Recargo</td><td>{{ resultado.recargo * 100 }}%</td></tr>
        <tr class="total"><td>TOTAL</td><td>${{ resultado.total.toFixed(2) }}</td></tr>
      </tbody>
    </table>
  </main>
</template>

<style>
body { font-family: system-ui, sans-serif; background: #f3f4f6; display: flex; justify-content: center; padding: 2rem; }
.card { background: #fff; padding: 2rem; border-radius: 12px; width: 340px; box-shadow: 0 4px 16px rgba(0,0,0,.08); }
h1 { margin: 0; } .sub { color: #6b7280; margin-top: 0; }
label { display: block; margin: .8rem 0; font-size: .9rem; }
input, select { width: 100%; padding: .5rem; margin-top: .25rem; box-sizing: border-box; }
button { width: 100%; padding: .7rem; background: #2563eb; color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
.error { color: #b91c1c; background: #fee2e2; padding: .5rem; border-radius: 6px; }
table { width: 100%; margin-top: 1rem; border-collapse: collapse; }
td { padding: .35rem 0; border-bottom: 1px solid #eee; } td:last-child { text-align: right; }
.total td { font-weight: bold; font-size: 1.1rem; }
</style>
