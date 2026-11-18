/* global jest, beforeEach */
import InventarioObjetos from './model/inventario.js';
import SistemaAuth from './model/auth.js';
import crearDocumentoPrueba, { clicEnDatos, textosDe } from './test-support/documento.js';

const estudiante = { nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' };
let controles;
let inventario;
let auth;
let objeto;
let actualizar;

function iniciarSesion() {
  auth.iniciarSesion('personal@ucb.edu.bo', 'clave');
  controles['login-form'].emitir('submit');
}

beforeEach(() => {
  controles = crearDocumentoPrueba();
  inventario = new InventarioObjetos();
  objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
  inventario.solicitarReserva(objeto.id, estudiante);
  auth = new SistemaAuth();
  auth.registrar('personal@ucb.edu.bo', 'clave');
  actualizar = jest.fn();
  const actualizarSolicitudes = require('./presenter/reservas-bienestar-presenter.js').default(inventario, auth, actualizar);
  actualizarSolicitudes();
});

describe('Revisar solicitudes en Bienestar', () => {
  it('muestra datos solo con sesión del personal y los retira al cerrar sesión', () => {
    expect(controles['lista-solicitudes-reserva'].children).toEqual([]);
    iniciarSesion();
    const textos = textosDe(controles['lista-solicitudes-reserva']);
    expect(textos).toContain('Ana Perez');
    expect(textos).toContain('76543210');
    expect(textos).toContain('ana@ucb.edu.bo');
    auth.cerrarSesion();
    controles['btn-logout'].emitir('click');
    expect(controles['lista-solicitudes-reserva'].children).toEqual([]);
  });

  it('acepta una solicitud y actualiza el catálogo y la bandeja', () => {
    iniciarSesion();
    controles['lista-solicitudes-reserva'].emitir('click', clicEnDatos('aceptarSolicitud', 1));
    expect(objeto.estado).toBe('Reservado');
    expect(objeto.reserva).toEqual(estudiante);
    expect(actualizar).toHaveBeenCalledTimes(1);
    expect(textosDe(controles['lista-solicitudes-reserva'])).toContain('No hay solicitudes pendientes');
    expect(controles['mensaje-solicitudes-bienestar'].textContent).toContain('aceptada');
  });

  it('vuelve a comprobar la sesión al aceptar una solicitud', () => {
    iniciarSesion();
    auth.cerrarSesion();
    controles['lista-solicitudes-reserva'].emitir('click', clicEnDatos('aceptarSolicitud', 1));
    expect(objeto.estado).toBe('Disponible');
    expect(actualizar).not.toHaveBeenCalled();
    expect(controles['mensaje-solicitudes-bienestar'].textContent).toContain('Debe iniciar sesión');
    expect(controles['lista-solicitudes-reserva'].children).toEqual([]);
  });
});
