import login from './estudiante-presenter.js';
import sistemaAvisos from './avisos-estado.js';
import { MENSAJES_AVISOS } from '../model/avisos.js';
import { renderizarCategorias, renderizarAvisos } from '../view/avisos-view.js';

const catalogo = document.querySelector('#catalogo-estudiante');
const seccion = document.querySelector('#seccion-mis-avisos');
const mensaje = document.querySelector('#mensaje-avisos');
const contenedorCategorias = document.querySelector('#avisos-categorias');
const contenedorAvisos = document.querySelector('#lista-avisos');
const btnVerAvisos = document.querySelector('#btn-ver-avisos');
const btnVolver = document.querySelector('#btn-volver-catalogo-avisos');

function mostrarMensaje(texto, exito) {
  if (!mensaje) {
    return;
  }
  mensaje.textContent = texto;
  mensaje.className = exito ? 'mensaje exito' : 'mensaje error';
}

function correoEstudiante() {
  const estudiante = login.obtenerEstudianteActual();
  return estudiante ? estudiante.correo : null;
}

export function actualizarAvisos() {
  const correo = correoEstudiante();
  if (!correo) {
    if (contenedorCategorias) {
      contenedorCategorias.replaceChildren();
    }
    if (contenedorAvisos) {
      contenedorAvisos.replaceChildren();
    }
    return;
  }
  renderizarCategorias(
    contenedorCategorias,
    sistemaAvisos.categoriasDisponibles(),
    sistemaAvisos.categoriasSuscritas(correo),
    alternarSuscripcion
  );
  renderizarAvisos(contenedorAvisos, sistemaAvisos.avisosDe(correo));
}

function alternarSuscripcion(categoria) {
  const correo = correoEstudiante();
  if (!correo) {
    mostrarMensaje(MENSAJES_AVISOS.sinSesion, false);
    return;
  }
  const yaSuscrita = sistemaAvisos.categoriasSuscritas(correo).includes(categoria);
  const resultado = yaSuscrita
    ? sistemaAvisos.cancelarSuscripcion(correo, categoria)
    : sistemaAvisos.suscribir(correo, categoria);
  mostrarMensaje(resultado.mensaje, resultado.exito);
  actualizarAvisos();
}

function abrirMisAvisos() {
  if (!login.tieneSesionEstudiante()) {
    mostrarMensaje(MENSAJES_AVISOS.sinSesion, false);
  } else {
    mostrarMensaje('', true);
  }
  if (catalogo) {
    catalogo.hidden = true;
  }
  if (seccion) {
    seccion.hidden = false;
  }
  actualizarAvisos();
}

function volverAlCatalogo() {
  if (seccion) {
    seccion.hidden = true;
  }
  if (catalogo) {
    catalogo.hidden = false;
  }
}

if (btnVerAvisos) {
  btnVerAvisos.addEventListener('click', abrirMisAvisos);
}

if (btnVolver) {
  btnVolver.addEventListener('click', volverAlCatalogo);
}

export default actualizarAvisos;