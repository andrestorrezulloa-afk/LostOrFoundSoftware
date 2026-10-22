import listar from './filter.js';

class InventarioObjetos {
  constructor() {
    this.objetos = [];
    this.siguienteId = 1;
  }

  listar(filtros = {}) {
    return listar.call(this, filtros);
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
    if (
      !datos.nombre ||
      !datos.nombre.trim() ||
      !datos.categoria ||
      !datos.categoria.trim()
    ) {
      return {
        exito: false,
        mensaje: "El nombre y la categoria son obligatorios",
      };
    }
    const nuevoObjeto = {
      id: this.siguienteId++,
      nombre: datos.nombre.trim(),
      categoria: datos.categoria.trim(),
      descripcion: datos.descripcion ? datos.descripcion.trim() : "",
      foto: datos.foto || "",
      lugarEncontrado: datos.lugarEncontrado ? datos.lugarEncontrado.trim() : "",
      registradoPor: datos.registradoPor || null,
      estado: "Disponible",
      fechaRegistro: new Date().toLocaleString(),
    };
    this.objetos.push(nuevoObjeto);
    return { exito: true, mensaje: "Objeto registrado exitosamente", objeto: nuevoObjeto };
  }

  puedePublicar(tieneSesionPersonal) {
    return Boolean(tieneSesionPersonal);
  }
}

export default InventarioObjetos;