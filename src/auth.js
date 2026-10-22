class SistemaAuth {
  registrar(correo, password) {
    if (!correo || !correo.includes("@") || !password) {
      return { exito: false, mensaje: "Correo o contrasena invalidos" };
    }
    return { exito: true, mensaje: "Cuenta creada exitosamente" };
  }
}

export default SistemaAuth;