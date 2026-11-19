class LoginEstudiante {
  constructor(opciones = {}) {
    this.proveedorGoogle = opciones.proveedorGoogle || (() => null);
    this.estudianteActual = null;
  }

  iniciarSesionConGoogle() {
    const cuenta = this.proveedorGoogle();
    this.estudianteActual = {
      correo: cuenta.correo,
      nombre: cuenta.nombre || '',
    };
    return {
      exito: true,
      mensaje: 'Sesion iniciada como estudiante',
      estudiante: this.obtenerEstudianteActual(),
    };
  }

  obtenerEstudianteActual() {
    if (!this.estudianteActual) {
      return null;
    }
    return { ...this.estudianteActual };
  }
}

export default LoginEstudiante;