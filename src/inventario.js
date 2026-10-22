class InventarioObjetos {
  constructor() {
    this.objetos = [];
    this.siguienteId = 1;
  }

  registrarObjeto(datos) {
    const nuevoObjeto = {
      id: this.siguienteId++,
      nombre: datos.nombre,
      categoria: datos.categoria,
      estado: "Disponible",
    };
    this.objetos.push(nuevoObjeto);
    return { exito: true, mensaje: "Objeto registrado exitosamente", objeto: nuevoObjeto };
  }

  obtenerCatalogo() {
    return this.objetos;
  }
}

export default InventarioObjetos;