import listar from './filter.js';
import { validarDatosReserva, prepararDatosReserva } from './datos-reserva.js';
import SolicitudesReserva from './solicitudes-reserva.js';

class InventarioObjetos {
  constructor() {
    this.objetos = [];
    this.siguienteId = 1;
    this.solicitudesReserva = new SolicitudesReserva();
  }

  listar(filtros = {}) {
    return listar.call(this, filtros);
  }

  obtenerCatalogo() {
    return this.objetos;
  }

  obtenerObjetoPorId(id) {
    return this.objetos.find((objeto) => objeto.id === id) || null;
  }

  obtenerUltimoPosteo() {
    let ultimoPosteo = null;

    for (const objeto of this.objetos) {
      if (!ultimoPosteo || this.esMasReciente(objeto, ultimoPosteo)) {
        ultimoPosteo = objeto;
      }
    }

    return ultimoPosteo;
  }

  esMasReciente(objeto, otroObjeto) {
    const fechaObjeto = this.obtenerFechaPublicacion(objeto);
    const fechaOtroObjeto = this.obtenerFechaPublicacion(otroObjeto);

    // Si se publicaron al mismo tiempo, el último registrado tiene el ID mayor.
    if (fechaObjeto === fechaOtroObjeto) {
      return objeto.id > otroObjeto.id;
    }

    return fechaObjeto > fechaOtroObjeto;
  }

  obtenerFechaPublicacion(objeto) {
    if (Number.isFinite(objeto.fechaPublicacionTimestamp)) {
      return objeto.fechaPublicacionTimestamp;
    }

    // Sin una fecha válida, se considera anterior a cualquier objeto con fecha.
    return -Infinity;
  }

  registrarObjeto(datos) {
    if (!this.tieneDatosObligatorios(datos)) {
      return {
        exito: false,
        mensaje: 'El nombre y la categoria son obligatorios',
      };
    }

    const nuevoObjeto = this.crearFichaObjeto(datos);
    this.objetos.push(nuevoObjeto);

    return { exito: true, mensaje: 'Objeto registrado exitosamente', objeto: nuevoObjeto };
  }

  tieneDatosObligatorios(datos) {
    return Boolean(datos.nombre?.trim() && datos.categoria?.trim());
  }

  cambiarEstado(id, nuevoEstado, tieneSesionPersonal, datosReserva) {
    if (!tieneSesionPersonal) {
      return { exito: false, mensaje: 'Debe iniciar sesión como personal' };
    }

    const objeto = this.obtenerObjetoPorId(id);
    if (!objeto) {
      return { exito: false, mensaje: 'Objeto no encontrado' };
    }

    if (!['Disponible', 'Reservado', 'Reclamado'].includes(nuevoEstado)) {
      return { exito: false, mensaje: 'Estado no válido' };
    }

    if (nuevoEstado === 'Reservado' && !objeto.reserva) {
      const resultado = this.reservarObjeto(id, datosReserva);
      if (!resultado.exito) {
        return resultado;
      }
    }

    if (nuevoEstado === 'Disponible') {
      delete objeto.reserva;
    }

    objeto.estado = nuevoEstado;
    return { exito: true, mensaje: 'Estado actualizado correctamente' };
  }

  reservarObjeto(id, datos = {}) {
    const objeto = this.obtenerObjetoPorId(id);
    if (!objeto) {
      return { exito: false, mensaje: 'Objeto no encontrado' };
    }
    if (objeto.estado !== 'Disponible') {
      return { exito: false, mensaje: 'Solo se pueden reservar objetos disponibles' };
    }
    const errorDatos = validarDatosReserva(datos);
    if (errorDatos) {
      return { exito: false, mensaje: errorDatos };
    }

    objeto.reserva = prepararDatosReserva(datos);
    objeto.estado = 'Reservado';
    return { exito: true, mensaje: 'Reserva registrada correctamente' };
  }

  solicitarReserva(id, datos) {
    return this.solicitudesReserva.registrar(this.obtenerObjetoPorId(id), datos);
  }

  obtenerSolicitudesPendientes(tieneSesionPersonal) {
    if (!tieneSesionPersonal) {
      return [];
    }
    return this.solicitudesReserva.listarPendientes();
  }

  crearFichaObjeto(datos) {
    const fechaPublicacion = new Date();

    return {
      id: this.siguienteId++,
      nombre: datos.nombre.trim(),
      categoria: datos.categoria.trim(),
      descripcion: datos.descripcion ? datos.descripcion.trim() : '',
      foto: datos.foto || '',
      lugarEncontrado: datos.lugarEncontrado ? datos.lugarEncontrado.trim() : '',
      registradoPor: datos.registradoPor || null,
      estado: 'Disponible',
      fechaRegistro: fechaPublicacion.toLocaleString(),
      fechaPublicacionTimestamp: fechaPublicacion.getTime(),
    };
  }

  puedePublicar(tieneSesionPersonal) {
    return Boolean(tieneSesionPersonal);
  }
}

export default InventarioObjetos;
