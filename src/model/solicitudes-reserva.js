import { validarDatosReserva, prepararDatosReserva } from './datos-reserva.js';

export default class SolicitudesReserva {
  constructor() {
    this.solicitudes = [];
    this.siguienteId = 1;
  }

  registrar(objeto, datos = {}) {
    if (!objeto) {
      return { exito: false, mensaje: 'Objeto no encontrado' };
    }
    if (objeto.estado !== 'Disponible') {
      return { exito: false, mensaje: 'Solo se pueden solicitar objetos disponibles' };
    }
    const errorDatos = validarDatosReserva(datos);
    if (errorDatos) {
      return { exito: false, mensaje: errorDatos };
    }

    const estudiante = prepararDatosReserva(datos);
    const yaSolicitado = this.listarPendientes().some((solicitud) =>
      solicitud.objetoId === objeto.id && solicitud.estudiante.correo === estudiante.correo);
    if (yaSolicitado) {
      return { exito: false, mensaje: 'Ya enviaste una solicitud pendiente para este objeto' };
    }

    this.solicitudes.push({
      id: this.siguienteId++, objetoId: objeto.id, estudiante, estado: 'Pendiente',
    });
    return { exito: true, mensaje: 'Solicitud enviada a Bienestar Estudiantil. Queda pendiente de aceptación.' };
  }

  listarPendientes() {
    return this.solicitudes.filter((solicitud) => solicitud.estado === 'Pendiente');
  }

  obtenerPendiente(id) {
    return this.listarPendientes().find((solicitud) => solicitud.id === id);
  }

  cerrarPendientesDelObjeto(objetoId) {
    for (const solicitud of this.listarPendientes()) {
      if (solicitud.objetoId === objetoId) {
        solicitud.estado = 'No disponible';
      }
    }
  }
}
