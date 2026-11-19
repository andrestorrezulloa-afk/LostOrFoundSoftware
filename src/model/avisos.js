const CATEGORIAS_DISPONIBLES = [
  'Llaves',
  'Electrónicos',
  'Documentos',
  'Ropa',
  'Útiles',
  'Otros',
];

export const MENSAJES_AVISOS = {
  suscripcionActivada: 'Suscripción activada',
  suscripcionCancelada: 'Suscripción cancelada',
  sinSesion: 'Debes iniciar sesión con tu cuenta institucional para suscribirte',
  categoriaInvalida: 'La categoría no está disponible',
};

class SistemaAvisos {
  constructor(opciones = {}) {
    this.almacenamiento = opciones.almacenamiento || new Map();
    this.avisos = [];
    this.enviarCorreo = opciones.enviarCorreo || (() => ({ exito: true }));
  }

  categoriasDisponibles() {
    return [...CATEGORIAS_DISPONIBLES];
  }

  obtenerSuscripciones(correo) {
    return this.almacenamiento.get(correo) || [];
  }

  suscribir(correo, categoria) {
    if (!correo || !correo.trim()) {
      return { exito: false, mensaje: MENSAJES_AVISOS.sinSesion };
    }
    if (!this.categoriasDisponibles().includes(categoria)) {
      return { exito: false, mensaje: MENSAJES_AVISOS.categoriaInvalida };
    }

    const suscripciones = this.obtenerSuscripciones(correo);
    const existente = suscripciones.find(
      (suscripcion) => suscripcion.categoria === categoria
    );
    if (existente) {
      existente.activa = true;
    } else {
      suscripciones.push({ categoria, activa: true });
    }
    this.almacenamiento.set(correo, suscripciones);

    return {
      exito: true,
      mensaje: MENSAJES_AVISOS.suscripcionActivada,
      suscripciones: this.obtenerSuscripciones(correo),
    };
  }

  cancelarSuscripcion(correo, categoria) {
    const suscripciones = this.obtenerSuscripciones(correo);
    const existente = suscripciones.find(
      (suscripcion) => suscripcion.categoria === categoria
    );
    if (existente) {
      existente.activa = false;
    }
    this.almacenamiento.set(correo, suscripciones);

    return {
      exito: true,
      mensaje: MENSAJES_AVISOS.suscripcionCancelada,
      suscripciones: this.obtenerSuscripciones(correo),
    };
  }

  publicarAvisoDeObjeto(objeto) {
    if (!objeto || objeto.estado !== 'Disponible') {
      return [];
    }

    const generados = [];
    for (const correo of this.almacenamiento.keys()) {
      const yaAvisado = this.avisos.some(
        (aviso) => aviso.correo === correo && aviso.objetoId === objeto.id
      );
      if (!yaAvisado && this.categoriasSuscritas(correo).includes(objeto.categoria)) {
        generados.push(this.generarAviso(correo, objeto));
      }
    }
    return generados;
  }

  categoriasSuscritas(correo) {
    return this.obtenerSuscripciones(correo)
      .filter((suscripcion) => suscripcion.activa)
      .map((suscripcion) => suscripcion.categoria);
  }

  generarAviso(correo, objeto) {
    const aviso = {
      id: this.avisos.length + 1,
      correo,
      categoria: objeto.categoria,
      objetoId: objeto.id,
      objeto,
      enlace: `#/objeto/${objeto.id}`,
      fecha: new Date().toISOString(),
    };
    this.avisos.push(aviso);
    return aviso;
  }

  avisosDe(correo) {
    return this.avisos.filter((aviso) => aviso.correo === correo);
  }
}

export default SistemaAvisos;