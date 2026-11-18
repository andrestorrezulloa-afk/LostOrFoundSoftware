import InventarioObjetos from './model/inventario.js';

const estudiante = { nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' };

describe('Enviar una solicitud a Bienestar', () => {
  it('guarda la solicitud pendiente sin cambiar el objeto ni reservarlo todavía', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
    const original = { ...objeto };
    const resultado = inventario.solicitarReserva(objeto.id, { nombre: ' Ana Perez ', telefono: ' 76543210 ', correo: ' ANA@UCB.EDU.BO ' });

    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toContain('Bienestar');
    expect(objeto).toEqual(original);
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([
      { id: 1, objetoId: objeto.id, estudiante, estado: 'Pendiente' },
    ]);
    expect(inventario.obtenerSolicitudesPendientes(false)).toEqual([]);
    expect(inventario.obtenerSolicitudesPendientes()).toEqual([]);
  });

  it('rechaza datos incompletos, objetos inexistentes y objetos no disponibles', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
    expect(inventario.solicitarReserva(objeto.id, { ...estudiante, nombre: ' ' }).exito).toBe(false);
    expect(inventario.solicitarReserva(objeto.id, { ...estudiante, telefono: '' }).exito).toBe(false);
    expect(inventario.solicitarReserva(objeto.id, { ...estudiante, correo: 'incorrecto' }).exito).toBe(false);
    expect(inventario.solicitarReserva(999, estudiante).exito).toBe(false);
    inventario.reservarObjeto(objeto.id, estudiante);
    expect(inventario.solicitarReserva(objeto.id, estudiante).exito).toBe(false);
    inventario.cambiarEstado(objeto.id, 'Reclamado', true);
    expect(inventario.solicitarReserva(objeto.id, estudiante).exito).toBe(false);
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
  });

  it('impide duplicar una solicitud pendiente del mismo correo y objeto', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
    inventario.solicitarReserva(objeto.id, estudiante);
    expect(inventario.solicitarReserva(objeto.id, { ...estudiante, correo: ' ANA@UCB.EDU.BO ' }).exito).toBe(false);
    expect(inventario.solicitarReserva(objeto.id, { ...estudiante, correo: 'luis@ucb.edu.bo' }).exito).toBe(true);
    expect(inventario.obtenerSolicitudesPendientes(true)).toHaveLength(2);
  });
});
