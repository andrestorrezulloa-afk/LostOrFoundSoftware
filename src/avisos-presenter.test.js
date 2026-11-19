/* global beforeEach, jest */
import crearDocumentoPrueba from './test-support/documento.js';

let controles;

function conectarPresentadores() {
  jest.resetModules();
  require('./presenter/estudiante-presenter.js');
  require('./presenter/avisos-presenter.js');
  require('./presenter/inventario-presenter.js');
  return require('./presenter/avisos-estado.js').default;
}

function iniciarSesionEstudiante() {
  controles['btn-login-google'].emitir('click');
  controles['google-cuenta-institucional'].emitir('click');
}

function abrirMisAvisos() {
  controles['btn-ver-avisos'].emitir('click');
}

function publicarObjeto(nombre, categoria) {
  controles['obj-nombre'].value = nombre;
  controles['obj-categoria'].value = categoria;
  controles['obj-descripcion'].value = 'Descripción de prueba';
  return controles['form-registrar-objeto'].emitir('submit', { preventDefault: () => {} });
}

function botonCategoria(categoria) {
  return controles['avisos-categorias'].children.find(
    (boton) => boton.dataset.categoria === categoria
  );
}

beforeEach(() => {
  controles = crearDocumentoPrueba();
});

describe('HU-12: Configuracion de avisos en la interfaz', () => {
  it('deberia exigir sesion de estudiante para configurar avisos', () => {
    conectarPresentadores();

    abrirMisAvisos();

    expect(controles['seccion-mis-avisos'].hidden).toEqual(false);
    expect(controles['mensaje-avisos'].textContent).toContain('iniciar sesión');
    expect(controles['avisos-categorias'].children.length).toEqual(0);
  });

  it('deberia listar las categorias y activar una suscripcion con la sesion iniciada', () => {
    conectarPresentadores();
    iniciarSesionEstudiante();
    abrirMisAvisos();

    expect(controles['avisos-categorias'].children.length).toEqual(6);
    botonCategoria('Electrónicos').emitir('click');

    expect(botonCategoria('Electrónicos').atributos['aria-pressed']).toEqual('true');
    expect(botonCategoria('Útiles').atributos['aria-pressed']).toEqual('false');
    expect(controles['mensaje-avisos'].textContent).toEqual('Suscripción activada');
  });

  it('deberia desactivar la suscripcion al volver a elegir la categoria', () => {
    conectarPresentadores();
    iniciarSesionEstudiante();
    abrirMisAvisos();

    botonCategoria('Electrónicos').emitir('click');
    botonCategoria('Electrónicos').emitir('click');

    expect(botonCategoria('Electrónicos').atributos['aria-pressed']).toEqual('false');
    expect(controles['mensaje-avisos'].textContent).toEqual('Suscripción cancelada');
  });

  it('deberia mostrar el aviso recibido cuando Bienestar publica en una categoria suscrita', async () => {
    conectarPresentadores();
    iniciarSesionEstudiante();
    abrirMisAvisos();
    botonCategoria('Electrónicos').emitir('click');

    await publicarObjeto('Casio', 'Electrónicos');
    await publicarObjeto('Mochila negra', 'Útiles');

    const avisos = controles['lista-avisos'].children;
    expect(avisos.length).toEqual(1);
    expect(avisos[0].children.map((hijo) => hijo.textContent).join(' ')).toContain('Casio');
  });
});