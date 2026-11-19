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
});