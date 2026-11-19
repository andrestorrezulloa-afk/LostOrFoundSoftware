import InventarioObjetos from './model/inventario.js';

const estudiante = { nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' };

describe('Reservas vinculadas al estado', () => {
  it('explica los errores de nombre, teléfono y correo institucional', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;
    for (const [datos, campo] of [
      [{ ...estudiante, nombre: '   ' }, 'nombre'],
      [{ ...estudiante, telefono: '   ' }, 'teléfono'],
      [{ ...estudiante, telefono: 'abc76543210' }, 'teléfono'],
      [{ ...estudiante, telefono: '12' }, 'teléfono'],
      [{ ...estudiante, correo: 'ana@gmail.com' }, 'institucional'],
    ]) {
      const resultado = inventario.reservarObjeto(objeto.id, datos);
      expect(resultado.exito).toBe(false);
      expect(resultado.mensaje).toContain(campo);
      expect(objeto.estado).toBe('Disponible');
    }
  });

  it('exige datos completos para asignar Reservado y conserva los demás datos', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;
    const original = { ...objeto };

    expect(inventario.cambiarEstado(objeto.id, 'Reservado', true).exito).toBe(false);
    expect(inventario.cambiarEstado(objeto.id, 'Reservado', true, { ...estudiante, nombre: ' ' }).exito).toBe(false);
    expect(inventario.cambiarEstado(objeto.id, 'Reservado', true, { ...estudiante, telefono: '' }).exito).toBe(false);
    expect(inventario.cambiarEstado(objeto.id, 'Reservado', true, { ...estudiante, correo: 'incorrecto' }).exito).toBe(false);
    expect(objeto).toEqual(original);
    expect(inventario.cambiarEstado(objeto.id, 'Reservado', false, estudiante).exito).toBe(false);
    expect(objeto).toEqual(original);

    expect(inventario.cambiarEstado(objeto.id, 'Reservado', true, estudiante)).toEqual({ exito: true, mensaje: 'Estado actualizado correctamente' });
    expect(objeto).toEqual({ ...original, estado: 'Reservado', reserva: estudiante });
  });

  it('impide nuevas reservas de objetos reservados o reclamados y permite reservar tras liberarlos', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;
    const otraPersona = { ...estudiante, nombre: 'Luis', telefono: '71234567' };

    expect(inventario.reservarObjeto(objeto.id, estudiante).exito).toBe(true);
    expect(inventario.reservarObjeto(objeto.id, otraPersona).exito).toBe(false);
    expect(objeto.reserva).toEqual(estudiante);
    expect(inventario.cambiarEstado(objeto.id, 'Reservado', true).exito).toBe(true);
    inventario.cambiarEstado(objeto.id, 'Reclamado', true);
    expect(inventario.reservarObjeto(objeto.id, otraPersona).exito).toBe(false);
    inventario.cambiarEstado(objeto.id, 'Disponible', true);
    expect(objeto.reserva).toBeUndefined();
    expect(inventario.reservarObjeto(objeto.id, otraPersona).exito).toBe(true);
    expect(objeto.reserva).toEqual(otraPersona);
  });

  it('rechaza reservas inválidas sin alterar el inventario', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Llaves', categoria: 'Llaves' }).objeto;
    expect(inventario.reservarObjeto(999, estudiante).exito).toBe(false);
    expect(inventario.reservarObjeto(objeto.id, {}).exito).toBe(false);
    expect(objeto.estado).toBe('Disponible');
    expect(objeto.reserva).toBeUndefined();
  });
});

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
