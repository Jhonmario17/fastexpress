const { calcularTarifa } = require('../src/cotizador');
const total = (p, c = 'NUEVO', e = 'ESTANDAR') => calcularTarifa(p, c, e).total;

describe('CAJA BLANCA - 9 caminos independientes (V(G)=9)', () => {
  test('C1: peso inválido', () => expect(() => calcularTarifa(0, 'NUEVO', 'ESTANDAR')).toThrow('Peso inválido'));
  test('C2: peso > 20', () => expect(() => calcularTarifa(25, 'NUEVO', 'ESTANDAR')).toThrow('Límite excedido'));
  test('C3: tramo 1, NUEVO, ESTANDAR', () => expect(total(3)).toBe(11.0));
  test('C4: tramo 2, NUEVO, ESTANDAR', () => expect(total(10)).toBe(45.0));
  test('C5: FRECUENTE', () => expect(total(3, 'FRECUENTE')).toBe(9.9));
  test('C6: VIP', () => expect(total(3, 'VIP')).toBe(8.8));
  test('C7: cliente inválido', () => expect(() => calcularTarifa(3, 'GOLD', 'ESTANDAR')).toThrow('cliente'));
  test('C8: EXPRESS', () => expect(total(3, 'NUEVO', 'EXPRESS')).toBe(13.75));
  test('C9: envío inválido', () => expect(() => calcularTarifa(3, 'NUEVO', 'DRON')).toThrow('envío'));
});

describe('CAJA NEGRA - Valores límite (BVA) de Peso', () => {
  test.each([
    [0.01, 5.02], [0.02, 5.04],
    [4.99, 14.98], [5.0, 15.0], [5.01, 25.04], [5.02, 25.08],
    [19.99, 84.96], [20.0, 85.0],
  ])('peso %p => $%p', (peso, esperado) => expect(total(peso)).toBe(esperado));

  test.each([[-1], [0], [0.009], [20.01], [NaN]])('peso %p es rechazado', (peso) =>
    expect(() => calcularTarifa(peso, 'NUEVO', 'ESTANDAR')).toThrow());
});

describe('CAJA NEGRA - Tabla de decisión Cliente x Envío (peso=10, subtotal=45)', () => {
  test.each([
    ['NUEVO', 'ESTANDAR', 45.0], ['NUEVO', 'EXPRESS', 56.25],
    ['FRECUENTE', 'ESTANDAR', 40.5], ['FRECUENTE', 'EXPRESS', 50.63],
    ['VIP', 'ESTANDAR', 36.0], ['VIP', 'EXPRESS', 45.0],
  ])('%s + %s => %p', (c, e, esperado) => expect(total(10, c, e)).toBe(esperado));
});

test('devuelve el desglose completo', () => {
  expect(calcularTarifa(3, 'VIP', 'EXPRESS')).toEqual({
    tarifaBase: 5, costoPeso: 6, subtotal: 11, descuento: 0.2, recargo: 0.25, total: 11,
  });
});
