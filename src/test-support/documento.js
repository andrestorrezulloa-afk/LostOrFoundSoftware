import fs from 'fs';

function crearControl() {
  return {
    value: '', hidden: false, textContent: '', children: [], dataset: {}, eventos: {}, atributos: {},
    addEventListener(tipo, accion) { (this.eventos[tipo] ||= []).push(accion); },
    emitir(tipo, evento = {}) { for (const accion of this.eventos[tipo] || []) { accion(evento); } },
    append(...hijos) { this.children.push(...hijos); },
    replaceChildren(...hijos) { this.children = hijos; },
    setAttribute(nombre, valor) { this.atributos[nombre] = valor; },
    removeAttribute(nombre) { delete this.atributos[nombre]; },
    focus() {},
  };
}

export default function crearDocumentoPrueba() {
  const controles = {};
  const html = fs.readFileSync('index.html', 'utf8');
  for (const coincidencia of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)) {
    controles[coincidencia[1]] = crearControl();
    controles[coincidencia[1]].hidden = /\bhidden\b/.test(coincidencia[0]);
  }
  globalThis.document = {
    querySelector: (selector) => controles[selector.slice(1)] || null,
    createElement: crearControl,
  };
  return controles;
}

export function clicEnDatos(propiedad, valor) {
  const boton = crearControl();
  boton.dataset[propiedad] = String(valor);
  return { target: { closest: (selector) => {
    const atributo = propiedad.replace(/[A-Z]/g, (letra) => `-${letra.toLowerCase()}`);
    return selector.includes(`data-${atributo}`) ? boton : null;
  } } };
}
