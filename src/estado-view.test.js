/* global beforeEach */
import { renderizarLista } from './view/catalogo-view.js';

function crearElemento(etiqueta) {
  return {
    etiqueta, children: [], dataset: {}, atributos: {}, textContent: '',
    append(...hijos) { this.children.push(...hijos); },
    replaceChildren(...hijos) { this.children = hijos; },
    setAttribute(nombre, valor) { this.atributos[nombre] = valor; },
  };
}

function elementosDe(elemento) {
  return [elemento, ...elemento.children.flatMap(elementosDe)];
}

beforeEach(() => {
  globalThis.document = { createElement: crearElemento };
});

describe('Estado en las tarjetas de objetos', () => {
  it('ofrece Reservar solo para objetos disponibles y distingue los tres estados', () => {
    const lista = crearElemento('div');
    for (const estado of ['Disponible', 'Reservado', 'Reclamado']) {
      renderizarLista(lista, [{ id: 1, nombre: 'Llaves', estado }], '', true);
      const elementos = elementosDe(lista);
      expect(elementos.some((elemento) => elemento.dataset.reservarId === '1')).toBe(estado === 'Disponible');
      const etiquetaEstado = elementos.find((elemento) => elemento.textContent === estado);
      expect(etiquetaEstado.className).toBe(`badge-estado estado-${estado.toLowerCase()}`);
    }
  });

  it('presenta los datos de una solicitud y su acción de aceptar en la vista de Bienestar', () => {
    const renderizarSolicitudes = require('./view/solicitudes-view.js').default;
    const lista = crearElemento('div');
    renderizarSolicitudes(lista, [{
      id: 7, nombreObjeto: 'Llaves', estudiante: { nombre: 'Ana Perez', telefono: '76543210', correo: 'ana@ucb.edu.bo' },
    }]);
    const elementos = elementosDe(lista);
    const textos = elementos.map((elemento) => elemento.textContent).join(' ');
    expect(textos).toContain('Ana Perez');
    expect(textos).toContain('76543210');
    expect(textos).toContain('ana@ucb.edu.bo');
    expect(elementos.find((elemento) => elemento.dataset.aceptarSolicitud === '7').textContent).toBe('Aceptar reserva');
    renderizarSolicitudes(lista, []);
    expect(elementosDe(lista).map((elemento) => elemento.textContent).join(' ')).toContain('No hay solicitudes pendientes');
  });

  it('muestra un botón de cambio de estado únicamente en las tarjetas del personal', () => {
    const objeto = { id: 1, nombre: 'Llaves', categoria: 'Llaves', estado: 'Disponible' };
    const lista = crearElemento('div');
    renderizarLista(lista, [objeto], '', false);
    const boton = elementosDe(lista).find((elemento) => elemento.dataset.cambiarEstado === '1');
    expect(boton).toBeDefined();
    expect(boton.textContent).toBe('Cambiar estado');
    expect(boton.atributos['aria-label']).toBe('Cambiar estado de Llaves');

    renderizarLista(lista, [objeto], '', true);
    expect(elementosDe(lista).some((elemento) => elemento.dataset.cambiarEstado)).toBe(false);
  });

  it('refleja los tres estados sin publicar los datos personales de la reserva', () => {
    const objeto = { id: 1, nombre: 'Llaves', categoria: 'Llaves', reserva: { nombre: 'Nombre privado', correo: 'privado@ucb.edu.bo' } };
    const lista = crearElemento('div');
    for (const estado of ['Disponible', 'Reservado', 'Reclamado']) {
      objeto.estado = estado;
      renderizarLista(lista, [objeto], '', true);
      const textos = elementosDe(lista).map((elemento) => elemento.textContent);
      expect(textos).toContain(estado);
      expect(textos.join(' ')).not.toContain('Nombre privado');
      expect(textos.join(' ')).not.toContain('privado@ucb.edu.bo');
    }
  });
});
