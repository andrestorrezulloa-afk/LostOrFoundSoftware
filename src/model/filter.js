const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function listar(filtros = {}) {
  const objetos = this && Array.isArray(this.objetos) ? this.objetos : [];
  const categoria = filtros && filtros.categoria;
  const nombre = filtros && filtros.nombre && filtros.nombre.trim();
  const lugarEncontrado = filtros && filtros.lugarEncontrado;

  if (!categoria && !nombre && !lugarEncontrado) {
    return objetos;
  }

  return objetos.filter((objeto) =>
    (!categoria || objeto.categoria === categoria) &&
    (!lugarEncontrado || objeto.lugarEncontrado === lugarEncontrado) &&
    (!nombre || normalizar(objeto.nombre).includes(normalizar(nombre)))
  );
}
