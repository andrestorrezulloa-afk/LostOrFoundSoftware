export default function listar(filtros = {}) {
  const objetos = this && Array.isArray(this.objetos) ? this.objetos : [];
  const categoria = filtros && filtros.categoria;
  const nombre = filtros && filtros.nombre;

  if (!categoria && !nombre) {
    return objetos;
  }

  return objetos.filter((objeto) =>
    (!categoria || objeto.categoria === categoria) &&
    (!nombre || objeto.nombre.toLowerCase().includes(nombre.toLowerCase()))
  );
}
