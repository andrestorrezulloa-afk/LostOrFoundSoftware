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
