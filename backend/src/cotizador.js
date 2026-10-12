// Núcleo de negocio de FastExpress. Es la función que analizamos con Caja Blanca.
const TARIFA_BASE = 5.0; // BR-01

function calcularTarifa(peso, tipoCliente, tipoEnvio) {
  // --- Validación de peso (BR-02) ---
  if (!(peso >= 0.01)) {                                   // P1 (también atrapa NaN)
    throw new Error('Peso inválido: debe ser mayor o igual a 0.01 kg');
  }
  if (peso > 20) {                                         // P2
    throw new Error('Límite excedido: el peso máximo es 20 kg');
  }

  // --- Costo por peso (BR-02) ---
  let costoPeso;
  if (peso <= 5) {                                         // P3
    costoPeso = peso * 2;
  } else {
    costoPeso = peso * 4;
  }
  const subtotal = TARIFA_BASE + costoPeso;                // BR-01 + BR-02

  // --- Descuento por tipo de cliente (BR-03) ---
  let descuento;
  if (tipoCliente === 'NUEVO') {                           // P4
    descuento = 0;
  } else if (tipoCliente === 'FRECUENTE') {                // P5
    descuento = 0.10;
  } else if (tipoCliente === 'VIP') {                      // P6
    descuento = 0.20;
  } else {
    throw new Error('Tipo de cliente inválido');
  }

  // --- Recargo por tipo de envío (BR-04) ---
  let recargo;
  if (tipoEnvio === 'ESTANDAR') {                          // P7
    recargo = 0;
  } else if (tipoEnvio === 'EXPRESS') {                    // P8
    recargo = 0.25;
  } else {
    throw new Error('Tipo de envío inválido');
  }

  const total = subtotal * (1 - descuento) * (1 + recargo);
  return {
    tarifaBase: TARIFA_BASE,
    costoPeso: redondear(costoPeso),
    subtotal: redondear(subtotal),
    descuento,
    recargo,
    total: redondear(total),
  };
}

function redondear(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

module.exports = { calcularTarifa };
