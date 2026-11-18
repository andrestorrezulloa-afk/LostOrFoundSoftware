import InventarioObjetos from './model/inventario.js';

const estudiante = { nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' };

describe('Aceptar solicitudes de reserva', () => {
  it('solo permite al personal aceptar y conserva los datos hasta la entrega', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
    const original = { ...objeto };
    inventario.solicitarReserva(objeto.id, estudiante);
    const solicitud = inventario.obtenerSolicitudesPendientes(true)[0];
    expect(inventario.aceptarSolicitudReserva(solicitud.id, false).exito).toBe(false);
    expect(inventario.aceptarSolicitudReserva(solicitud.id).exito).toBe(false);
    expect(objeto).toEqual(original);
    expect(inventario.aceptarSolicitudReserva(999, true).exito).toBe(false);

    expect(inventario.aceptarSolicitudReserva(solicitud.id, true).exito).toBe(true);
    expect(solicitud.estado).toBe('Aceptada');
    expect(objeto).toEqual({ ...original, estado: 'Reservado', reserva: estudiante });
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
    inventario.cambiarEstado(objeto.id, 'Reclamado', true);
    expect(objeto).toEqual({ ...original, estado: 'Reclamado', reserva: estudiante });
    expect(inventario.aceptarSolicitudReserva(solicitud.id, true).exito).toBe(false);
  });

  it('cierra las solicitudes competidoras y no las reactiva al liberar el objeto', () => {
    const inventario = new InventarioObjetos();
    const objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
    inventario.solicitarReserva(objeto.id, estudiante);
    inventario.solicitarReserva(objeto.id, { ...estudiante, correo: 'luis@ucb.edu.bo' });
    const [primera, segunda] = inventario.obtenerSolicitudesPendientes(true);
    inventario.aceptarSolicitudReserva(primera.id, true);
    expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
    expect(inventario.aceptarSolicitudReserva(segunda.id, true).exito).toBe(false);
    expect(objeto.reserva).toEqual(estudiante);
    inventario.cambiarEstado(objeto.id, 'Disponible', true);
    expect(inventario.aceptarSolicitudReserva(segunda.id, true).exito).toBe(false);
    expect(inventario.solicitarReserva(objeto.id, estudiante).exito).toBe(true);
  });

  it('no acepta solicitudes si el objeto ya fue reclamado o reservado manualmente', () => {
    for (const estado of ['Reservado', 'Reclamado']) {
      const inventario = new InventarioObjetos();
      const objeto = inventario.registrarObjeto({ nombre: 'Mochila', categoria: 'Útiles' }).objeto;
      inventario.solicitarReserva(objeto.id, estudiante);
      const solicitud = inventario.obtenerSolicitudesPendientes(true)[0];
      inventario.cambiarEstado(objeto.id, estado, true, estudiante);
      expect(inventario.aceptarSolicitudReserva(solicitud.id, true).exito).toBe(false);
      expect(inventario.obtenerSolicitudesPendientes(true)).toEqual([]);
      expect(objeto.estado).toBe(estado);
    }
  });
});

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
