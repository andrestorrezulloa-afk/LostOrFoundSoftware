/* global beforeEach, jest */
import crearDocumentoPrueba from './test-support/documento.js';

let controles;

function conectarPresentador() {
  jest.resetModules();
  return require('./presenter/estudiante-presenter.js').default;
}

beforeEach(() => {
  controles = crearDocumentoPrueba();
});

describe('HU-11: Inicio de sesion de estudiante en la interfaz', () => {
  it('deberia identificar al estudiante y mostrar su vista al iniciar sesion con cuenta institucional', () => {
    const login = conectarPresentador();

    controles['btn-login-google'].emitir('click');
    controles['google-cuenta-institucional'].emitir('click');

    expect(controles['estudiante-actual'].textContent).toEqual('Estudiante UCB');
    expect(controles['seccion-auth'].style.display).toEqual('none');
    expect(controles['vista-estudiante'].style.display).toEqual('flex');
    expect(controles['vista-google'].hidden).toEqual(true);
    expect(login.obtenerEstudianteActual()).toEqual({
      correo: 'estudiante@ucb.edu.bo',
      nombre: 'Estudiante UCB',
    });
  });

  it('deberia mostrar un mensaje claro y no habilitar la vista con una cuenta ajena', () => {
    const login = conectarPresentador();

    controles['btn-login-google'].emitir('click');
    controles['google-cuenta-ajena'].emitir('click');

    expect(controles['mensaje-sistema'].textContent).toEqual(
      'Solo las cuentas con correo institucional (@ucb.edu.bo) pueden iniciar sesion'
    );
    expect(controles['vista-estudiante'].style.display).not.toEqual('flex');
    expect(login.obtenerEstudianteActual()).toEqual(null);
  });

  it('deberia cerrar la sesion del estudiante y volver al acceso como visitante', () => {
    conectarPresentador();

    controles['btn-login-google'].emitir('click');
    controles['google-cuenta-institucional'].emitir('click');
    controles['btn-logout-estudiante'].emitir('click');

    expect(controles['estudiante-actual'].textContent).toEqual('');
    expect(controles['seccion-auth'].style.display).toEqual('flex');
    expect(controles['vista-estudiante'].style.display).toEqual('none');
  });
});