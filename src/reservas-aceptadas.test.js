/* global jest */
import InventarioObjetos from './model/inventario.js';
import SistemaAuth from './model/auth.js';
import crearDocumentoPrueba, { textosDe } from './test-support/documento.js';
import conectarReservasBienestar from './presenter/reservas-bienestar-presenter.js';

it('presenta reservas aceptadas solo al personal y retira las ya entregadas', () => {
  const controles = crearDocumentoPrueba();
  const inventario = new InventarioObjetos();
  const objeto = inventario.registrarObjeto({ nombre: 'Mochila azul', categoria: 'Útiles', lugarEncontrado: 'Tupuraya 1' }).objeto;
  inventario.reservarObjeto(objeto.id, { nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' });
  const auth = new SistemaAuth();
  auth.registrar('personal@ucb.edu.bo', 'clave');
  const actualizar = conectarReservasBienestar(inventario, auth, jest.fn());
  actualizar();
  expect(controles['lista-reservas-aceptadas'].children).toEqual([]);
  auth.iniciarSesion('personal@ucb.edu.bo', 'clave');
  actualizar();
  const textos = textosDe(controles['lista-reservas-aceptadas']);
  for (const dato of ['Mochila azul', 'Reservado', 'Ana Perez', '76543210', 'ana@ucb.edu.bo']) {
    expect(textos).toContain(dato);
  }
  inventario.cambiarEstado(objeto.id, 'Reclamado', true);
  actualizar();
  expect(textosDe(controles['lista-reservas-aceptadas'])).toContain('No hay reservas en espera de entrega');
  auth.cerrarSesion();
  actualizar();
  expect(controles['lista-reservas-aceptadas'].children).toEqual([]);
});
