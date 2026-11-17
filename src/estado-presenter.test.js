/* global jest, beforeEach */
import fs from 'fs';
import InventarioObjetos from './model/inventario.js';
import SistemaAuth from './model/auth.js';

let controles;
let inventario;
let auth;
let actualizarCatalogos;
let objeto;

function abrirEditor() {
  controles['lista-catalogo-staff'].eventos.click({
    target: { closest: () => ({ dataset: { cambiarEstado: String(objeto.id) } }) },
  });
}

function elegirEstado(estado) {
  controles['nuevo-estado'].value = estado;
  controles['nuevo-estado'].eventos.change();
}

function confirmar() {
  controles['form-cambiar-estado'].eventos.submit({ preventDefault() {} });
}

beforeEach(() => {
  controles = {};
  const html = fs.readFileSync('index.html', 'utf8');
  for (const [, id] of html.matchAll(/id="([^"]+)"/g)) {
    controles[id] = {
      value: '', hidden: true, textContent: '', eventos: {},
      addEventListener(evento, accion) { this.eventos[evento] = accion; },
      focus: jest.fn(),
    };
  }
  globalThis.document = { querySelector: (selector) => controles[selector.slice(1)] || null };
  inventario = new InventarioObjetos();
  objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
  auth = new SistemaAuth();
  auth.registrar('personal@ucb.edu.bo', 'clave');
  auth.iniciarSesion('personal@ucb.edu.bo', 'clave');
  actualizarCatalogos = jest.fn();
  require('./presenter/estado-presenter.js').default(inventario, auth, actualizarCatalogos);
});

describe('Cambio de estado desde el panel', () => {
  it('edita sin guardar hasta confirmar y actualiza el catálogo con un mensaje de éxito', () => {
    abrirEditor();
    expect(controles['editor-estado'].hidden).toBe(false);
    expect(controles['nombre-objeto-estado'].textContent).toBe('Mochila');
    expect(controles['nuevo-estado'].value).toBe('Disponible');
    elegirEstado('Reclamado');
    expect(objeto.estado).toBe('Disponible');
    confirmar();
    expect(objeto.estado).toBe('Reclamado');
    expect(actualizarCatalogos).toHaveBeenCalledTimes(1);
    expect(controles['mensaje-cambio-estado'].textContent).toBe('Estado actualizado correctamente');
    expect(controles['editor-estado'].hidden).toBe(true);
  });

  it('cancela sin modificar el objeto ni su reserva', () => {
    inventario.reservarObjeto(objeto.id, { nombre: 'Ana', codigoEstudiante: '123', correo: 'ana@ucb.edu.bo' });
    const original = JSON.stringify(objeto);
    abrirEditor();
    elegirEstado('Disponible');
    controles['btn-cancelar-estado'].eventos.click();
    expect(JSON.stringify(objeto)).toBe(original);
    expect(actualizarCatalogos).not.toHaveBeenCalled();
    expect(controles['editor-estado'].hidden).toBe(true);
  });

  it('impide abrir o guardar el cambio sin sesión de personal', () => {
    auth.cerrarSesion();
    abrirEditor();
    expect(controles['editor-estado'].hidden).toBe(true);
    auth.iniciarSesion('personal@ucb.edu.bo', 'clave');
    abrirEditor();
    elegirEstado('Reclamado');
    auth.cerrarSesion();
    confirmar();
    expect(objeto.estado).toBe('Disponible');
    expect(actualizarCatalogos).not.toHaveBeenCalled();
    expect(controles['mensaje-cambio-estado'].textContent).toBe('Debe iniciar sesión como personal');
  });

  it('solicita datos para reservar y permite liberar la reserva desde el formulario', () => {
    abrirEditor();
    elegirEstado('Reservado');
    expect(controles['datos-reserva-estado'].hidden).toBe(false);
    expect(controles['reserva-nombre'].required).toBe(true);
    confirmar();
    expect(objeto.estado).toBe('Disponible');
    expect(controles['editor-estado'].hidden).toBe(false);
    controles['reserva-nombre'].value = 'Ana';
    controles['reserva-codigo'].value = '123';
    controles['reserva-correo'].value = 'ana@ucb.edu.bo';
    confirmar();
    expect(objeto.estado).toBe('Reservado');
    expect(objeto.reserva.nombre).toBe('Ana');
    abrirEditor();
    expect(controles['reserva-nombre'].readOnly).toBe(true);
    elegirEstado('Disponible');
    confirmar();
    expect(objeto.estado).toBe('Disponible');
    expect(objeto.reserva).toBeUndefined();
  });
});
