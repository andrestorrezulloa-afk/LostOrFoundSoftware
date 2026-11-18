/* global jest, beforeEach */
import InventarioObjetos from './model/inventario.js';
import crearDocumentoPrueba, { clicEnDatos } from './test-support/documento.js';

let controles;
let inventario;
let objeto;
let actualizar;

function abrirReserva() {
  controles['lista-catalogo-estudiante'].emitir('click', clicEnDatos('reservarId', objeto.id));
}

function enviarReserva() {
  controles['form-solicitar-reserva'].emitir('submit', { preventDefault() {} });
}

beforeEach(() => {
  controles = crearDocumentoPrueba();
  inventario = new InventarioObjetos();
  objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
  actualizar = jest.fn();
  require('./presenter/reserva-estudiante-presenter.js').default(inventario, actualizar);
});

describe('Solicitar reserva desde el catálogo público', () => {
  it('abre el formulario y envía los datos a Bienestar sin reservar automáticamente', () => {
    abrirReserva();
    expect(controles['formulario-reserva-estudiante'].hidden).toBe(false);
    expect(controles['nombre-objeto-reserva'].textContent).toBe('Mochila');
    controles['solicitud-nombre'].value = 'Ana Perez';
    controles['solicitud-telefono'].value = '76543210';
    controles['solicitud-correo'].value = 'ana@ucb.edu.bo';
    enviarReserva();
    expect(inventario.obtenerSolicitudesPendientes(true)[0].estudiante).toEqual({ nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' });
    expect(objeto.estado).toBe('Disponible');
    expect(controles['mensaje-solicitud-reserva'].textContent).toContain('pendiente');
    expect(controles['formulario-reserva-estudiante'].hidden).toBe(true);
    expect(controles['solicitud-telefono'].value).toBe('');
    expect(actualizar).toHaveBeenCalledTimes(1);
  });

  it('cancela sin crear solicitudes ni modificar los datos del objeto', () => {
    const original = JSON.stringify(objeto);
    abrirReserva();
    controles['solicitud-nombre'].value = 'Ana';
    controles['btn-cancelar-reserva'].emitir('click');
    expect(JSON.stringify(objeto)).toBe(original);
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
    expect(controles['catalogo-estudiante'].hidden).toBe(false);
    expect(controles['solicitud-nombre'].value).toBe('');
  });

  it('explica errores y conserva el formulario para corregirlos', () => {
    abrirReserva();
    enviarReserva();
    expect(controles['mensaje-solicitud-reserva'].textContent).toContain('nombre');
    controles['solicitud-nombre'].value = 'Ana';
    enviarReserva();
    expect(controles['mensaje-solicitud-reserva'].textContent).toContain('teléfono');
    controles['solicitud-telefono'].value = '76543210';
    controles['solicitud-correo'].value = 'ana@gmail.com';
    enviarReserva();
    expect(controles['mensaje-solicitud-reserva'].textContent).toContain('institucional');
    expect(controles['formulario-reserva-estudiante'].hidden).toBe(false);
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
  });

  it('impide solicitar un objeto no disponible incluso desde un botón anterior', () => {
    inventario.cambiarEstado(objeto.id, 'Reclamado', true);
    abrirReserva();
    expect(controles['formulario-reserva-estudiante'].hidden).toBe(true);
    expect(controles['mensaje-solicitud-reserva'].textContent).toContain('disponible');
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
  });
});
