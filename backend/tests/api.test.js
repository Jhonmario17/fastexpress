const request = require('supertest');
const app = require('../src/app');

test('POST /api/cotizar OK', async () => {
  const r = await request(app).post('/api/cotizar').send({ peso: 3, tipoCliente: 'NUEVO', tipoEnvio: 'ESTANDAR' });
  expect(r.status).toBe(200);
  expect(r.body.total).toBe(11);
});
test('POST /api/cotizar error de negocio => 400', async () => {
  const r = await request(app).post('/api/cotizar').send({ peso: 50, tipoCliente: 'NUEVO', tipoEnvio: 'ESTANDAR' });
  expect(r.status).toBe(400);
  expect(r.body.error).toMatch(/Límite/);
});
test('POST sin body => 400', async () => {
  const r = await request(app).post('/api/cotizar');
  expect(r.status).toBe(400);
});
