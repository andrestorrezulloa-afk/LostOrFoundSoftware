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

  registrarObjeto(datos) {
    const nuevoObjeto = {
      id: this.siguienteId++,
      nombre: datos.nombre,
      categoria: datos.categoria,
      descripcion: datos.descripcion || "",
      foto: datos.foto || "",
      estado: "Disponible",
      fechaRegistro: new Date().toLocaleString(),
    };
    this.objetos.push(nuevoObjeto);
    return { exito: true, mensaje: "Objeto registrado exitosamente", objeto: nuevoObjeto };
  }

  registrarObjeto(datos) {
    if (!datos.nombre || !datos.nombre.trim()) {
      return {
        exito: false,
        mensaje: "El nombre y la categoria son obligatorios",
      };
    }
    const nuevoObjeto = {
      id: this.siguienteId++,
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      descripcion: datos.descripcion || "",
      foto: datos.foto || "",
      estado: "Disponible",
      fechaRegistro: new Date().toLocaleString(),
    };
    this.objetos.push(nuevoObjeto);
    return { exito: true, mensaje: "Objeto registrado exitosamente", objeto: nuevoObjeto };
  }
}

export default InventarioObjetos;