export default function listar(filtros = {}) {
  const objetos = this && Array.isArray(this.objetos) ? this.objetos : [];
  const categoria = filtros && filtros.categoria;

  
  return objetos.filter((objeto) => objeto.categoria === categoria);
}