/* global jest */
import InventarioObjetos from './model/inventario.js';

describe('Ordenar publicaciones del catálogo', () => {
  it('combina los filtros con ambos órdenes usando publicación y no hallazgo', () => {
    const inventario = new InventarioObjetos();
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date('2026-03-01T10:00:00Z'));
      const antiguo = inventario.registrarObjeto({ nombre: 'Mochila azul', categoria: 'Útiles', lugarEncontrado: 'Terraza' }).objeto;
      jest.setSystemTime(new Date('2026-03-02T10:00:00Z'));
      const reciente = inventario.registrarObjeto({ nombre: 'Mochila negra', categoria: 'Útiles', lugarEncontrado: 'Terraza' }).objeto;
      const empate = inventario.registrarObjeto({ nombre: 'Mochila roja', categoria: 'Útiles', lugarEncontrado: 'Terraza' }).objeto;
      inventario.registrarObjeto({ nombre: 'Mochila blanca', categoria: 'Útiles', lugarEncontrado: 'Aula A1-3' });
      antiguo.fechaHallazgo = '2026-02-28';
      reciente.fechaHallazgo = '2026-01-01';
      const catalogoOriginal = [...inventario.obtenerCatalogo()];
      const filtros = { nombre: 'mochila', categoria: 'Útiles', lugarEncontrado: 'Terraza' };

      expect(inventario.listar({ ...filtros, orden: 'recientes' })).toEqual([empate, reciente, antiguo]);
      expect(inventario.listar({ ...filtros, orden: 'antiguos' })).toEqual([antiguo, reciente, empate]);
      expect(inventario.listar({ orden: 'recientes' })[0].id).toBe(4);
      expect(inventario.obtenerCatalogo()).toEqual(catalogoOriginal);
      expect(inventario.listar({ lugarEncontrado: 'Biblioteca', orden: 'antiguos' })).toEqual([]);
    } finally {
      jest.useRealTimers();
    }
  });
});
