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

  it("deberia guardar descripcion, foto opcional y generar fechaRegistro automatica", () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({
      nombre: "Mochila negra",
      categoria: "Utiles",
      descripcion: "Encontrada en el bloque C",
      foto: "data:image/png;base64,ejemplo",
    });
    const objeto = inventario.obtenerCatalogo()[0];
    expect(objeto.descripcion).toEqual("Encontrada en el bloque C");
    expect(objeto.foto).toEqual("data:image/png;base64,ejemplo");
    expect(Boolean(objeto.fechaRegistro)).toEqual(true);
  });

  it("no deberia guardar y deberia mostrar mensaje claro si falta el nombre", () => {
    const inventario = new InventarioObjetos();
    const res = inventario.registrarObjeto({
      nombre: "",
      categoria: "Llaves",
    });
    expect(res.exito).toEqual(false);
    expect(res.mensaje).toEqual("El nombre y la categoria son obligatorios");
    expect(inventario.obtenerCatalogo().length).toEqual(0);
  });

  it("no deberia guardar y deberia mostrar mensaje claro si falta la categoria", () => {
    const inventario = new InventarioObjetos();
    const res = inventario.registrarObjeto({
      nombre: "Carnet universitario",
      categoria: "",
    });
    expect(res.exito).toEqual(false);
    expect(res.mensaje).toEqual("El nombre y la categoria son obligatorios");
    expect(inventario.obtenerCatalogo().length).toEqual(0);
  });

  it("no deberia permitir ver la opcion de publicar a estudiantes sin sesion de personal", () => {
    const inventario = new InventarioObjetos();
    expect(inventario.puedePublicar(false)).toEqual(false);
    expect(inventario.puedePublicar(true)).toEqual(true);
  });

  it("deberia guardar el lugar donde se encontro el objeto", () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({
      nombre: "Mochila negra",
      categoria: "Utiles",
      lugarEncontrado: "Bloque C, aula 204",
    });
    const objeto = inventario.obtenerCatalogo()[0];
    expect(objeto.lugarEncontrado).toEqual("Bloque C, aula 204");
  });

  it("deberia guardar quien registro el objeto", () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({
      nombre: "Casio",
      categoria: "Electronicos",
      registradoPor: { correo: "admin@ucb.edu.bo", nombre: "Ana Perez" },
    });
    const objeto = inventario.obtenerCatalogo()[0];
    expect(objeto.registradoPor).toEqual({
      correo: "admin@ucb.edu.bo",
      nombre: "Ana Perez",
    });
  });
});

describe('HU-03: Ver detalle básico del objeto', () => {
  it('recupera por id el objeto registrado con sus datos originales sin modificar el catálogo', () => {
    const inventario = new InventarioObjetos();
    inventario.registrarObjeto({ nombre: 'Llavero', categoria: 'Llaves' });
    const objeto = inventario.registrarObjeto({
      nombre: 'Mochila negra',
      categoria: 'Útiles',
      foto: 'data:image/png;base64,ejemplo',
    }).objeto;
    const contenidoOriginal = { ...objeto };

    const detalle = inventario.obtenerObjetoPorId(objeto.id);

    expect(detalle).toBe(objeto);
    expect(detalle).toMatchObject({
      foto: 'data:image/png;base64,ejemplo',
      nombre: 'Mochila negra',
      categoria: 'Útiles',
      estado: 'Disponible',
    });
    expect(objeto).toEqual(contenidoOriginal);
    expect(inventario.obtenerCatalogo()).toHaveLength(2);
  });

  it('devuelve null cuando el id no existe, sin alterar los objetos', () => {
    const inventario = new InventarioObjetos();
    expect(inventario.obtenerObjetoPorId(1)).toBeNull();

    const objeto = inventario.registrarObjeto({ nombre: 'Lápiz', categoria: 'Útiles' }).objeto;
    expect(inventario.obtenerObjetoPorId(999)).toBeNull();
    expect(inventario.obtenerObjetoPorId(String(objeto.id))).toBeNull();
    expect(inventario.obtenerCatalogo()).toEqual([objeto]);
  });
});
