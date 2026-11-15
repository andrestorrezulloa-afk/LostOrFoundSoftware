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

  obtenerUltimoPosteo() {
    return this.objetos.reduce((ultimo, objeto) => {
      if (!ultimo) {
        return objeto;
      }
      const fechaObjeto = Number.isFinite(objeto.fechaPublicacionTimestamp)
        ? objeto.fechaPublicacionTimestamp : -Infinity;
      const fechaUltimo = Number.isFinite(ultimo.fechaPublicacionTimestamp)
        ? ultimo.fechaPublicacionTimestamp : -Infinity;
      return fechaObjeto > fechaUltimo ||
        (fechaObjeto === fechaUltimo && objeto.id > ultimo.id) ? objeto : ultimo;
    }, null);
  }

  registrarObjeto(datos) {
    if (!datos.nombre?.trim() || !datos.categoria?.trim()) {
      return {
        exito: false,
        mensaje: "El nombre y la categoria son obligatorios",
    };
  }
    const fechaPublicacion = new Date();
    const nuevoObjeto = {
      id: this.siguienteId++,
      nombre: datos.nombre.trim(),
      categoria: datos.categoria.trim(),
      descripcion: datos.descripcion ? datos.descripcion.trim() : "",
      foto: datos.foto || "",
      lugarEncontrado: datos.lugarEncontrado ? datos.lugarEncontrado.trim() : "",
      registradoPor: datos.registradoPor || null,
      estado: "Disponible",
      fechaRegistro: fechaPublicacion.toLocaleString(),
      fechaPublicacionTimestamp: fechaPublicacion.getTime(),
    };
    this.objetos.push(nuevoObjeto);
    return { exito: true, mensaje: "Objeto registrado exitosamente", objeto: nuevoObjeto };
  }

  puedePublicar(tieneSesionPersonal) {
    return Boolean(tieneSesionPersonal);
  }
}

export default InventarioObjetos;
