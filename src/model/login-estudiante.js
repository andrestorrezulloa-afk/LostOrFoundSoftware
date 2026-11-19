const DOMINIOS_INSTITUCIONALES_POR_DEFECTO = ['ucb.edu.bo'];

export const MENSAJES_LOGIN_ESTUDIANTE = {
  exito: 'Sesion iniciada como estudiante',
  dominioNoAutorizado:
    'Solo las cuentas con correo institucional (@ucb.edu.bo) pueden iniciar sesion',
  falloGoogle: 'No se pudo iniciar sesion con Google. Intentalo de nuevo.',
};

class LoginEstudiante {
  constructor(opciones = {}) {
    this.dominiosInstitucionales = [...DOMINIOS_INSTITUCIONALES_POR_DEFECTO];
    this.proveedorGoogle = opciones.proveedorGoogle || (() => null);
    this.estudianteActual = null;
  }

  iniciarSesionConGoogle() {
    let cuenta = null;
    try {
      cuenta = this.proveedorGoogle();
    } catch (error) {
      cuenta = null;
    }

    if (!cuenta || !cuenta.correo) {
      this.estudianteActual = null;
      return { exito: false, mensaje: MENSAJES_LOGIN_ESTUDIANTE.falloGoogle };
    }

    if (!this.esCorreoInstitucional(cuenta.correo)) {
      this.estudianteActual = null;
      return { exito: false, mensaje: MENSAJES_LOGIN_ESTUDIANTE.dominioNoAutorizado };
    }

    this.estudianteActual = {
      correo: cuenta.correo,
      nombre: cuenta.nombre || '',
    };
    return {
      exito: true,
      mensaje: MENSAJES_LOGIN_ESTUDIANTE.exito,
      estudiante: this.obtenerEstudianteActual(),
    };
  }

  esCorreoInstitucional(correo) {
    return this.dominiosInstitucionales.includes(this.dominioDe(correo));
  }

  dominioDe(correo) {
    return String(correo || '').split('@')[1]?.toLowerCase() || '';
  }

  obtenerEstudianteActual() {
    if (!this.estudianteActual) {
      return null;
    }
    return { ...this.estudianteActual };
  }

  tieneSesionEstudiante() {
    return this.estudianteActual !== null;
  }

  puedeConfigurarAvisos() {
    return this.tieneSesionEstudiante();
  }

  cerrarSesion() {
    this.estudianteActual = null;
  }

  // La sesion de estudiante jamas concede acceso al panel de Bienestar.
  puedeAccederAlPanel() {
    return false;
  }
}

export default LoginEstudiante;