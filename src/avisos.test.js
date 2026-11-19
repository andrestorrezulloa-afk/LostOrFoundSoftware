import SistemaAvisos from './model/avisos.js';

const CORREO = 'estudiante@ucb.edu.bo';

describe('HU-12: Suscribirse a avisos de nuevos objetos por categoria', () => {
  it('deberia permitir a un estudiante autenticado activar una suscripcion por categoria', () => {
    const avisos = new SistemaAvisos();

    const resultado = avisos.suscribir(CORREO, 'Electrónicos');

    expect(resultado.exito).toEqual(true);
    expect(avisos.obtenerSuscripciones(CORREO)).toEqual([
      { categoria: 'Electrónicos', activa: true },
    ]);
  });

  it('deberia permitir desactivar una suscripcion individual sin afectar las demas', () => {
    const avisos = new SistemaAvisos();
    avisos.suscribir(CORREO, 'Electrónicos');
    avisos.suscribir(CORREO, 'Útiles');

    const resultado = avisos.cancelarSuscripcion(CORREO, 'Electrónicos');

    expect(resultado.exito).toEqual(true);
    expect(avisos.obtenerSuscripciones(CORREO)).toEqual([
      { categoria: 'Electrónicos', activa: false },
      { categoria: 'Útiles', activa: true },
    ]);
  });

  it('deberia guardar las preferencias y mostrarlas cuando el mismo estudiante inicia sesion de nuevo', () => {
    const almacenamiento = new Map();
    const avisos = new SistemaAvisos({ almacenamiento });
    avisos.suscribir(CORREO, 'Electrónicos');

    const nuevaSesion = new SistemaAvisos({ almacenamiento });

    expect(nuevaSesion.obtenerSuscripciones(CORREO)).toEqual([
      { categoria: 'Electrónicos', activa: true },
    ]);
  });

  it('deberia generar un aviso con la categoria, el objeto y el enlace al detalle al publicar en una categoria suscrita', () => {
    const avisos = new SistemaAvisos();
    avisos.suscribir(CORREO, 'Electrónicos');

    const generados = avisos.publicarAvisoDeObjeto({
      id: 7,
      nombre: 'Casio',
      categoria: 'Electrónicos',
      estado: 'Disponible',
    });

    expect(generados.length).toEqual(1);
    expect(generados[0].correo).toEqual(CORREO);
    expect(generados[0].categoria).toEqual('Electrónicos');
    expect(generados[0].objeto.nombre).toEqual('Casio');
    expect(generados[0].enlace).toEqual('#/objeto/7');
    expect(avisos.avisosDe(CORREO).length).toEqual(1);
  });
});