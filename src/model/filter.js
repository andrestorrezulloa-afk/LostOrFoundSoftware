const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function compararPublicaciones(primero, segundo) {
  const fechaPrimero = Number.isFinite(primero.fechaPublicacionTimestamp) ? primero.fechaPublicacionTimestamp : -Infinity;
  const fechaSegundo = Number.isFinite(segundo.fechaPublicacionTimestamp) ? segundo.fechaPublicacionTimestamp : -Infinity;

  if (fechaPrimero === fechaSegundo) {
    return primero.id - segundo.id;
  }

  return fechaPrimero - fechaSegundo;
}

function ordenarPublicaciones(objetos, orden) {
  if (!orden) {
    return objetos;
  }

  // Ordenar una copia conserva el orden original del inventario.
  const publicaciones = [...objetos].sort(compararPublicaciones);
  if (orden === 'recientes') {
    publicaciones.reverse();
  }
  return publicaciones;
}

export default function listar(filtros = {}) {
  const objetos = this && Array.isArray(this.objetos) ? this.objetos : [];
  const categoria = filtros && filtros.categoria;
  const nombre = filtros && filtros.nombre && filtros.nombre.trim();
  const lugarEncontrado = filtros && filtros.lugarEncontrado;

  if (!categoria && !nombre && !lugarEncontrado) {
    return ordenarPublicaciones(objetos, filtros && filtros.orden);
  }

  const coincidencias = objetos.filter((objeto) =>
    (!categoria || objeto.categoria === categoria) &&
    (!lugarEncontrado || objeto.lugarEncontrado === lugarEncontrado) &&
    (!nombre || normalizar(objeto.nombre).includes(normalizar(nombre)))
  );
  return ordenarPublicaciones(coincidencias, filtros && filtros.orden);
}
