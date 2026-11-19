/* global jest */
import InventarioObjetos from './model/inventario.js';
import crearDocumentoPrueba, { clicEnDatos, textosDe } from './test-support/documento.js';
import conectarReservaEstudiante from './presenter/reserva-estudiante-presenter.js';

it('presenta el objeto elegido junto al formulario sin publicar información privada', () => {
  const controles = crearDocumentoPrueba();
  const inventario = new InventarioObjetos();
  const objeto = inventario.registrarObjeto({ nombre: 'Mochila azul', categoria: 'Útiles', lugarEncontrado: 'Tupuraya 2' }).objeto;
  conectarReservaEstudiante(inventario, jest.fn());
  controles['lista-catalogo-estudiante'].emitir('click', clicEnDatos('reservarId', objeto.id));
  const resumen = textosDe(controles['resumen-objeto-reserva']);
  expect(resumen).toContain('Mochila azul');
  expect(resumen).toContain('Tupuraya 2');
  expect(resumen).toContain('Útiles');
  expect(controles['formulario-reserva-estudiante'].hidden).toBe(false);
  expect(objeto.estado).toBe('Disponible');
});
