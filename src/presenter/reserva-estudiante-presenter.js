export default function conectarReservaEstudiante(inventario, actualizarCatalogos) {
  const catalogo = document.querySelector('#catalogo-estudiante');
  const lista = document.querySelector('#lista-catalogo-estudiante');
  const detalle = document.querySelector('#detalle-estudiante');
  const seccion = document.querySelector('#formulario-reserva-estudiante');
  const formulario = document.querySelector('#form-solicitar-reserva');
  const nombreObjeto = document.querySelector('#nombre-objeto-reserva');
  const nombre = document.querySelector('#solicitud-nombre');
  const telefono = document.querySelector('#solicitud-telefono');
  const correo = document.querySelector('#solicitud-correo');
  const mensaje = document.querySelector('#mensaje-solicitud-reserva');
  const cancelar = document.querySelector('#btn-cancelar-reserva');
  let objetoSeleccionado = null;
  let desdeDetalle = false;

  function mostrarMensaje(texto, exito) {
    mensaje.textContent = texto;
    mensaje.className = exito ? 'mensaje exito' : 'mensaje error';
  }

  function cerrarFormulario() {
    if (!objetoSeleccionado) {
      return;
    }
    seccion.hidden = true;
    catalogo.hidden = desdeDetalle;
    detalle.hidden = !desdeDetalle;
    objetoSeleccionado = null;
    for (const campo of [nombre, telefono, correo]) {
      campo.value = '';
    }
  }

  function abrirFormulario(evento) {
    const boton = evento.target.closest('button[data-reservar-id]');
    if (!boton) {
      return;
    }
    const objeto = inventario.obtenerObjetoPorId(Number(boton.dataset.reservarId));
    if (!objeto || objeto.estado !== 'Disponible') {
      mostrarMensaje('Este objeto ya no está disponible para solicitar una reserva', false);
      return;
    }
    objetoSeleccionado = objeto;
    desdeDetalle = !detalle.hidden;
    nombreObjeto.textContent = objeto.nombre;
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
    catalogo.hidden = true;
    detalle.hidden = true;
    seccion.hidden = false;
    nombre.focus();
  }

  lista.addEventListener('click', abrirFormulario);
  detalle.addEventListener('click', abrirFormulario);
  cancelar.addEventListener('click', cerrarFormulario);
  document.querySelector('#btn-volver-login').addEventListener('click', cerrarFormulario);
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!objetoSeleccionado) {
      return;
    }
    const resultado = inventario.solicitarReserva(objetoSeleccionado.id, {
      nombre: nombre.value, telefono: telefono.value, correo: correo.value,
    });
    mostrarMensaje(resultado.mensaje, resultado.exito);
    if (resultado.exito) {
      cerrarFormulario();
      actualizarCatalogos();
    }
  });
}
