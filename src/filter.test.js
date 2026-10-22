import InventarioObjetos from "./inventario.js";

describe("HU-02: Listar objetos registrados", () => {
  it("deberia listar solo los objetos de la categoria indicada", () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({ nombre: "Llavero", categoria: "Llaves" });
    inventario.registrarObjeto({ nombre: "Casio", categoria: "Electronicos" });
    const lista = inventario.listar({ categoria: "Llaves" });
    expect(lista.length).toEqual(1);
    expect(lista[0].nombre).toEqual("Llavero");
  });
  
    it("deberia listar todos los objetos si no se indica ningun filtro", () => {
  const inventario = new InventarioObjetos();
  inventario.registrarObjeto({ nombre: "Llavero", categoria: "Llaves" });
  inventario.registrarObjeto({ nombre: "Casio", categoria: "Electronicos" });
  expect(inventario.listar().length).toEqual(2);
});
});