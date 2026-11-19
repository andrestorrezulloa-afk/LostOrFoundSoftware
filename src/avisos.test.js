import SistemaAvisos from './model/avisos.js';
import InventarioObjetos from './model/inventario.js';

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

  it('deberia generar los avisos cuando Bienestar publica un objeto nuevo desde el inventario', () => {
    const avisos = new SistemaAvisos();
    avisos.suscribir(CORREO, 'Electrónicos');
    const inventario = new InventarioObjetos({ avisos });

    const registro = inventario.registrarObjeto({ nombre: 'Casio', categoria: 'Electrónicos' });

    expect(registro.exito).toEqual(true);
    expect(avisos.avisosDe(CORREO).length).toEqual(1);
    expect(avisos.avisosDe(CORREO)[0].objeto.nombre).toEqual('Casio');
  });

  it('no deberia generar avisos para categorias no seleccionadas ni duplicar el aviso de una misma publicacion', () => {
    const avisos = new SistemaAvisos();
    avisos.suscribir('suscrito@ucb.edu.bo', 'Electrónicos');
    const objeto = { id: 9, nombre: 'Tablet', categoria: 'Electrónicos', estado: 'Disponible' };

    avisos.publicarAvisoDeObjeto(objeto);
    avisos.publicarAvisoDeObjeto(objeto);
    const otraCategoria = { id: 10, nombre: 'Mochila', categoria: 'Útiles', estado: 'Disponible' };
    avisos.publicarAvisoDeObjeto(otraCategoria);

    expect(avisos.avisosDe('suscrito@ucb.edu.bo').length).toEqual(1);
    expect(avisos.avisosDe('sin-suscripcion@ucb.edu.bo').length).toEqual(0);
  });

  it('no deberia generar un aviso al editar los datos de un objeto ni al volver a abrir su ficha', () => {
    const avisos = new SistemaAvisos();
    avisos.suscribir(CORREO, 'Electrónicos');
    const inventario = new InventarioObjetos({ avisos });
    const registro = inventario.registrarObjeto({ nombre: 'Casio', categoria: 'Electrónicos' });
    expect(avisos.avisosDe(CORREO).length).toEqual(1);

    const edicion = inventario.actualizarObjeto(registro.objeto.id, { descripcion: 'Con tapa grafito' });
    inventario.obtenerObjetoPorId(registro.objeto.id);

    expect(edicion.exito).toEqual(true);
    expect(avisos.avisosDe(CORREO).length).toEqual(1);
    expect(inventario.obtenerObjetoPorId(registro.objeto.id).descripcion).toEqual('Con tapa grafito');
  });
});