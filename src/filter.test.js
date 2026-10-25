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

describe('HU-02: Buscar objetos por nombre y categoría', () => {
  it('encuentra coincidencias parciales por nombre sin modificar el catálogo', () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({ nombre: 'Mochila negra', categoria: 'Accesorios' });
    inventario.registrarObjeto({ nombre: 'Llavero', categoria: 'Llaves' });

    expect(inventario.listar({ nombre: 'mochi' }).map((objeto) => objeto.nombre)).toEqual(['Mochila negra']);
    expect(inventario.obtenerCatalogo().map((objeto) => objeto.nombre)).toEqual(['Mochila negra', 'Llavero']);
  });

  it('busca sin distinguir mayúsculas y minúsculas', () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({ nombre: 'Mochila negra', categoria: 'Accesorios' });

    for (const nombre of ['MOCHILA', 'mochila', 'MoChIlA']) {
      expect(inventario.listar({ nombre }).map((objeto) => objeto.nombre)).toEqual(['Mochila negra']);
    }
  });

  it('busca nombres sin importar las tildes del objeto o la consulta', () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({ nombre: 'Teléfono', categoria: 'Electrónicos' });
    inventario.registrarObjeto({ nombre: 'Lápiz', categoria: 'Útiles' });

    expect(inventario.listar({ nombre: 'telefono' }).map((objeto) => objeto.nombre)).toEqual(['Teléfono']);
    expect(inventario.listar({ nombre: 'lapiz' }).map((objeto) => objeto.nombre)).toEqual(['Lápiz']);
    expect(inventario.listar({ nombre: 'teléfono' }).map((objeto) => objeto.nombre)).toEqual(['Teléfono']);
  });
});
