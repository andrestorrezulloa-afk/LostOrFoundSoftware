/* global jest, beforeEach */
import fs from 'fs';

jest.mock('./view/catalogo-view.js', () => ({
  renderizarLista: jest.fn(),
  renderizarBanner: jest.fn(),
}));
jest.mock('./presenter/auth-presenter.js', () => ({
  __esModule: true,
  default: { obtenerUsuarioActual: () => null },
}));
jest.mock('./model/inventario.js', () => {
  const Inventario = jest.requireActual('./model/inventario.js').default;
  return { __esModule: true, default: jest.fn(() => {
    const inventario = new Inventario();
    const datos = [
      ['Mochila azul', 'Útiles', 'Terraza', 100],
      ['Mochila negra', 'Útiles', 'Terraza', 200],
      ['Llavero', 'Llaves', 'Aula A1-3', 300],
      ['Libro', 'Útiles', '', 400],
    ];
    for (const [nombre, categoria, lugarEncontrado, fecha] of datos) {
      inventario.registrarObjeto({ nombre, categoria, lugarEncontrado }).objeto.fechaPublicacionTimestamp = fecha;
    }
    return inventario;
  }) };
});

// Solo simulamos los controles y eventos; el filtrado usa el inventario real.
function crearControl() {
  return {
    value: '', children: [], eventos: {},
    addEventListener(evento, accion) { this.eventos[evento] = accion; },
    replaceChildren(...children) { this.children = children; },
    append(...children) { this.children.push(...children); },
  };
}

let controles;
let renderizarLista;
function resultadosPublicos() {
  return renderizarLista.mock.calls.filter(([lista]) => lista === controles['lista-catalogo-estudiante']).pop()[1];
}
function cambiar(id, valor) {
  const control = controles[id];
  control.value = valor;
  control.eventos.change();
}

beforeEach(() => {
  jest.resetModules();
  renderizarLista = require('./view/catalogo-view.js').renderizarLista;
  const html = fs.readFileSync('index.html', 'utf8');
  controles = {};
  for (const coincidencia of html.matchAll(/id="([^"]+)"/g)) {
    controles[coincidencia[1]] = crearControl();
  }
  globalThis.document = {
    querySelector: (selector) => controles[selector.slice(1)] || null,
    createElement: () => crearControl(),
  };
  controles['form-busqueda-publica'].reset = () => {
    for (const id of ['filtro-nombre-estudiante', 'filtro-categoria-estudiante', 'filtro-lugar-estudiante']) {
      controles[id].value = '';
    }
    controles['orden-publicaciones'].value = 'recientes';
  };
  require('./presenter/inventario-presenter.js');
});

describe('Búsqueda pública por lugar y antigüedad', () => {
  it('ofrece lugares registrados sin duplicados y combina selecciones sin iniciar sesión', () => {
    expect(controles['filtro-lugar-estudiante']).toBeDefined();
    expect(controles['filtro-lugar-estudiante'].children.map((opcion) => opcion.value)).toEqual(['', 'Aula A1-3', 'Terraza']);
    controles['filtro-nombre-estudiante'].value = 'mochila';
    controles['filtro-categoria-estudiante'].value = 'Útiles';
    cambiar('filtro-lugar-estudiante', 'Terraza');
    cambiar('orden-publicaciones', 'antiguos');
    expect(resultadosPublicos().map((objeto) => objeto.nombre)).toEqual(['Mochila azul', 'Mochila negra']);
    cambiar('orden-publicaciones', 'recientes');
    expect(resultadosPublicos().map((objeto) => objeto.nombre)).toEqual(['Mochila negra', 'Mochila azul']);
    expect(controles['filtro-lugar-estudiante'].value).toBe('Terraza');
    expect(controles['filtro-nombre-estudiante'].value).toBe('mochila');
    expect(controles['filtro-categoria-estudiante'].value).toBe('Útiles');
  });

  it('muestra un mensaje sin coincidencias y permite limpiar los filtros', () => {
    expect(controles['btn-limpiar-filtros']).toBeDefined();
    controles['filtro-nombre-estudiante'].value = 'inexistente';
    cambiar('filtro-lugar-estudiante', 'Terraza');
    expect(resultadosPublicos()).toEqual([]);
    expect(renderizarLista.mock.calls.some(([, objetos, mensaje]) => !objetos.length && mensaje.includes('No se encontraron'))).toBe(true);
    controles['btn-limpiar-filtros'].eventos.click();
    expect(resultadosPublicos().map((objeto) => objeto.nombre)).toEqual(['Libro', 'Llavero', 'Mochila negra', 'Mochila azul']);
    expect(controles['filtro-lugar-estudiante'].value).toBe('');
  });
});
