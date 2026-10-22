class SistemaAuth {
  constructor() {
    this.usuarios = [];
  }

  registrar(correo, password) {
    if (!correo || !correo.includes("@") || !password) {
      return { exito: false, mensaje: "Correo o contrasena invalidos" };
    }
    const existe = this.usuarios.find((u) => u.correo === correo);
    if (existe) {
      return { exito: false, mensaje: "El correo ya esta registrado" };
    }
    this.usuarios.push({ correo, password });
    return { exito: true, mensaje: "Cuenta creada exitosamente" };
  }

  iniciarSesion(correo, password) {
    return { exito: true, mensaje: "Sesion iniciada" };
  }

  puedeAccederAlPanel() {
    return true;
  }
}

export default SistemaAuth;