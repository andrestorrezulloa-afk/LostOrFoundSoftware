import listar from './filter.js';

class InventarioObjetos {
  constructor() {
    this.objetos = [];
    this.siguienteId = 1;
  }

  listar(filtros = {}) {
    return listar.call(this, filtros);
  }

  obtenerCatalogo() {
    return this.objetos;
  }

  obtenerObjetoPorId(id) {
    return this.objetos.find((objeto) => objeto.id === id) || null;
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
