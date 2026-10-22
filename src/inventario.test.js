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
});