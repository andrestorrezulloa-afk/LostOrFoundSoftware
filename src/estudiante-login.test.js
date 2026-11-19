import LoginEstudiante from './model/login-estudiante.js';
import InventarioObjetos from './model/inventario.js';

function cuentaGoogle(correo, nombre = 'Estudiante Demo') {
  return { correo, nombre };
}

describe('HU-11: Acceder opcionalmente con cuenta institucional', () => {
  it('deberia iniciar sesion con una cuenta Google institucional e identificar la sesion del estudiante', () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => cuentaGoogle('estudiante@ucb.edu.bo'),
    });

    const resultado = login.iniciarSesionConGoogle();

    expect(resultado.exito).toEqual(true);
    expect(login.obtenerEstudianteActual()).toEqual({
      correo: 'estudiante@ucb.edu.bo',
      nombre: 'Estudiante Demo',
    });
  });

  it('no deberia habilitar funciones personalizadas con una cuenta ajena a los dominios institucionales', () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => cuentaGoogle('visitante@gmail.com'),
    });

    const resultado = login.iniciarSesionConGoogle();

    expect(resultado.exito).toEqual(false);
    expect(resultado.mensaje).toEqual(
      'Solo las cuentas con correo institucional (@ucb.edu.bo) pueden iniciar sesion'
    );
    expect(login.obtenerEstudianteActual()).toEqual(null);
    expect(login.puedeConfigurarAvisos()).toEqual(false);
  });

  it('no deberia habilitar funciones personalizadas y deberia mostrar un mensaje claro si falla el inicio de sesion con Google', () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => {
        throw new Error('popup bloqueado');
      },
    });

    const resultado = login.iniciarSesionConGoogle();

    expect(resultado.exito).toEqual(false);
    expect(resultado.mensaje).toEqual(
      'No se pudo iniciar sesion con Google. Intentalo de nuevo.'
    );
    expect(login.obtenerEstudianteActual()).toEqual(null);
    expect(login.puedeConfigurarAvisos()).toEqual(false);
  });

  it('deberia cerrar la sesion del estudiante y permitir seguir consultando el catalogo como visitante', () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => cuentaGoogle('estudiante@ucb.edu.bo'),
    });
    login.iniciarSesionConGoogle();
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({ nombre: 'Llavero', categoria: 'Llaves' });

    login.cerrarSesion();

    expect(login.obtenerEstudianteActual()).toEqual(null);
    expect(login.tieneSesionEstudiante()).toEqual(false);
    expect(inventario.listar().length).toEqual(1);
  });

  it('no deberia permitir que la sesion de estudiante entre al panel ni a las acciones de Bienestar', () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => cuentaGoogle('estudiante@ucb.edu.bo'),
    });
    login.iniciarSesionConGoogle();

    expect(login.tieneSesionEstudiante()).toEqual(true);
    expect(login.puedeAccederAlPanel()).toEqual(false);
  });

  it('deberia aceptar cuentas de los dominios institucionales configurados explicitamente', () => {
    const login = new LoginEstudiante({
      dominiosInstitucionales: ['ucb.edu.bo', 'ucb.edu'],
      proveedorGoogle: () => cuentaGoogle('estudiante@ucb.edu'),
    });

    const resultado = login.iniciarSesionConGoogle();

    expect(resultado.exito).toEqual(true);
    expect(login.obtenerEstudianteActual()).toEqual({
      correo: 'estudiante@ucb.edu',
      nombre: 'Estudiante Demo',
    });
  });
});