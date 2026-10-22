import InventarioObjetos from "./inventario.js";

describe("HU-01: Registrar objeto encontrado", () => {
  it("deberia registrar un objeto con nombre y categoria obligatorios", () => {
    const inventario = new InventarioObjetos();
    const res = inventario.registrarObjeto({
      nombre: "Calculadora Casio",
      categoria: "Electronicos",
    });
    expect(res.exito).toEqual(true);
  });

  it("deberia guardar el objeto en el catalogo con id unico y estado Disponible", () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({
      nombre: "Calculadora Casio",
      categoria: "Electronicos",
    });
    const catalogo = inventario.obtenerCatalogo();
    expect(catalogo.length).toEqual(1);
    expect(catalogo[0].id).toEqual(1);
    expect(catalogo[0].nombre).toEqual("Calculadora Casio");
    expect(catalogo[0].categoria).toEqual("Electronicos");
    expect(catalogo[0].estado).toEqual("Disponible");
  });
});