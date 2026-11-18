/* global beforeEach */
import InventarioObjetos from './model/inventario.js';
import SistemaAuth from './model/auth.js';
import crearDocumentoPrueba from './test-support/documento.js';

let controles;
let auth;
let inventario;

beforeEach(() => {
  controles = crearDocumentoPrueba();
  auth = new SistemaAuth();
  auth.registrar('personal@ucb.edu.bo', 'clave', 'Ana Perez');
  inventario = new InventarioObjetos();
  require('./presenter/panel-presenter.js').default(inventario, auth);
});

function entrar() {
  auth.iniciarSesion('personal@ucb.edu.bo', 'clave');
  controles['login-form'].emitir('submit');
}

describe('Navegación de Bienestar', () => {
  it('abre Inicio al entrar y muestra una sola sección con su navegación activa', () => {
    entrar();
    expect(controles['admin-inicio'].hidden).toBe(false);
    controles['nav-registro'].emitir('click');
    for (const seccion of ['inicio', 'registro', 'objetos', 'reservas']) {
      expect(controles[`admin-${seccion}`].hidden).toBe(seccion !== 'registro');
    }
    expect(controles['nav-registro'].atributos['aria-current']).toBe('page');
    expect(controles['titulo-pagina-admin'].textContent).toBe('Registrar objeto');
    controles['acceso-reservas'].emitir('click');
    expect(controles['admin-reservas'].hidden).toBe(false);
    expect(controles['admin-registro'].hidden).toBe(true);
  });

  it('no permite navegar sin sesión y oculta las secciones al salir', () => {
    controles['nav-reservas'].emitir('click');
    expect(controles['admin-reservas'].hidden).toBe(true);
    entrar();
    auth.cerrarSesion();
    controles['btn-logout'].emitir('click');
    for (const seccion of ['inicio', 'registro', 'objetos', 'reservas']) {
      expect(controles[`admin-${seccion}`].hidden).toBe(true);
    }
    controles['nav-objetos'].emitir('click');
    expect(controles['admin-objetos'].hidden).toBe(true);
  });

  it('calcula el resumen con los objetos existentes al volver a Inicio', () => {
    entrar();
    const datos = { nombre: 'Ana', telefono: '76543210', correo: 'ana@ucb.edu.bo' };
    const disponible = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;
    const reservado = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
    const reclamado = inventario.registrarObjeto({ nombre: 'Libro', categoria: 'Útiles' }).objeto;
    inventario.reservarObjeto(reservado.id, datos);
    inventario.cambiarEstado(reclamado.id, 'Reclamado', true);
    const original = JSON.stringify(inventario.obtenerCatalogo());
    controles['nav-inicio'].emitir('click');
    expect(controles['resumen-disponibles'].textContent).toBe('1');
    expect(controles['resumen-reservados'].textContent).toBe('1');
    expect(controles['resumen-reclamados'].textContent).toBe('1');
    expect(controles['nombre-personal'].textContent).toBe('Ana Perez');
    expect(JSON.stringify(inventario.obtenerCatalogo())).toBe(original);
    expect(disponible.estado).toBe('Disponible');
  });
});
