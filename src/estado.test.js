import InventarioObjetos from './model/inventario.js';

describe('Cambiar el estado de un objeto', () => {
  it('permite al personal cambiar el estado sin modificar los demás datos', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves', lugarEncontrado: 'Tupuraya 1' }).objeto;
    const datosOriginales = { ...objeto };

    expect(inventario.cambiarEstado(objeto.id, 'Reclamado', true)).toEqual({ exito: true, mensaje: 'Estado actualizado correctamente' });
    expect(objeto).toEqual({ ...datosOriginales, estado: 'Reclamado' });
    expect(inventario.cambiarEstado(objeto.id, 'Disponible', true).exito).toBe(true);
    expect(objeto).toEqual(datosOriginales);
  });

  it('rechaza cambios sin sesión de personal', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;

    expect(inventario.cambiarEstado(objeto.id, 'Reclamado', false)).toEqual({ exito: false, mensaje: 'Debe iniciar sesión como personal' });
    expect(inventario.cambiarEstado(objeto.id, 'Reclamado').exito).toBe(false);
    expect(objeto.estado).toBe('Disponible');
  });

  it('rechaza objetos inexistentes y estados fuera de las tres opciones', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;

    expect(inventario.cambiarEstado(999, 'Reclamado', true)).toEqual({ exito: false, mensaje: 'Objeto no encontrado' });
    expect(inventario.cambiarEstado(objeto.id, 'Eliminado', true)).toEqual({ exito: false, mensaje: 'Estado no válido' });
    expect(objeto.estado).toBe('Disponible');
  });
});
