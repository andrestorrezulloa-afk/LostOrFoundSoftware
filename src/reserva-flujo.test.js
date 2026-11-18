/* global jest */
import crearDocumentoPrueba, { clicEnDatos, textosDe } from './test-support/documento.js';

it('conecta solicitud, aceptación, consulta pública y entrega sin volver a ingresar datos', async () => {
  jest.resetModules();
  const controles = crearDocumentoPrueba();
  require('./presenter/inventario-presenter.js');
  const auth = require('./presenter/auth-presenter.js').default;
  auth.registrar('personal@ucb.edu.bo', 'clave');
  const enviar = { preventDefault() {} };
  async function iniciarSesion() {
    controles['login-correo'].value = 'personal@ucb.edu.bo';
    controles['login-password'].value = 'clave';
    await controles['login-form'].emitir('submit', enviar);
  }
  await iniciarSesion();
  controles['obj-nombre'].value = 'Mochila';
  controles['obj-categoria'].value = 'Útiles';
  controles['obj-lugar'].value = 'Tupuraya 1';
  await controles['form-registrar-objeto'].emitir('submit', enviar);
  await controles['btn-logout'].emitir('click');
  await controles['btn-ver-catalogo-publico'].emitir('click');
  await controles['lista-catalogo-estudiante'].emitir('click', clicEnDatos('reservarId', 1));
  controles['solicitud-nombre'].value = 'Ana Perez';
  controles['solicitud-telefono'].value = '76543210';
  controles['solicitud-correo'].value = 'ana@ucb.edu.bo';
  await controles['form-solicitar-reserva'].emitir('submit', enviar);
  expect(textosDe(controles['lista-catalogo-estudiante'])).toContain('Disponible');
  await controles['btn-volver-login'].emitir('click');
  await iniciarSesion();
  expect(textosDe(controles['lista-solicitudes-reserva'])).toContain('76543210');
  await controles['lista-solicitudes-reserva'].emitir('click', clicEnDatos('aceptarSolicitud', 1));
  expect(textosDe(controles['lista-catalogo-staff'])).toContain('Reservado');
  expect(textosDe(controles['lista-catalogo-estudiante'])).toContain('Reservado');
  await controles['lista-catalogo-staff'].emitir('click', clicEnDatos('cambiarEstado', 1));
  expect(controles['reserva-nombre'].value).toBe('Ana Perez');
  expect(controles['reserva-telefono'].value).toBe('76543210');
  expect(controles['reserva-correo'].value).toBe('ana@ucb.edu.bo');
  controles['nuevo-estado'].value = 'Reclamado';
  await controles['nuevo-estado'].emitir('change');
  expect(controles['datos-reserva-estado'].hidden).toBe(false);
  await controles['form-cambiar-estado'].emitir('submit', enviar);
  expect(textosDe(controles['lista-catalogo-estudiante'])).toContain('Reclamado');
  await controles['btn-logout'].emitir('click');
  await controles['btn-ver-catalogo-publico'].emitir('click');
  await controles['lista-catalogo-estudiante'].emitir('click', clicEnDatos('objetoId', 1));
  expect(controles['detalle-estado'].textContent).toBe('Reclamado');
  expect(controles['detalle-estado'].className).toBe('badge-estado estado-reclamado');
  expect(controles['btn-reservar-detalle'].hidden).toBe(true);
  const publico = textosDe(controles['lista-catalogo-estudiante']);
  expect(publico).not.toContain('Ana Perez');
  expect(publico).not.toContain('76543210');
  expect(publico).not.toContain('ana@ucb.edu.bo');
});
