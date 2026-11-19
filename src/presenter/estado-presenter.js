export default function conectarCambioEstado(inventario, auth, actualizarCatalogos) {
  const listaPersonal = document.querySelector('#lista-catalogo-staff');
  const editor = document.querySelector('#editor-estado');
  const formulario = document.querySelector('#form-cambiar-estado');
  const nombreObjeto = document.querySelector('#nombre-objeto-estado');
  const nuevoEstado = document.querySelector('#nuevo-estado');
  const datosReserva = document.querySelector('#datos-reserva-estado');
  const nombre = document.querySelector('#reserva-nombre');
  const telefono = document.querySelector('#reserva-telefono');
  const correo = document.querySelector('#reserva-correo');
  const cancelar = document.querySelector('#btn-cancelar-estado');
  const mensaje = document.querySelector('#mensaje-cambio-estado');
  let objetoSeleccionado = null;

  function mostrarMensaje(texto, exito) {
    mensaje.textContent = texto;
    mensaje.className = exito ? 'mensaje exito' : 'mensaje error';
  }

  function actualizarCamposReserva() {
    const necesitaReserva = nuevoEstado.value === 'Reservado';
    const mostrarDatos = necesitaReserva || Boolean(objetoSeleccionado.reserva);
    datosReserva.hidden = !mostrarDatos;
    datosReserva.disabled = !mostrarDatos;
    for (const campo of [nombre, telefono, correo]) {
      campo.readOnly = Boolean(objetoSeleccionado.reserva);
      campo.required = necesitaReserva && !objetoSeleccionado.reserva;
    }
  }

  function cerrarEditor() {
    editor.hidden = true;
    objetoSeleccionado = null;
  }

  listaPersonal.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-cambiar-estado]');
    if (!boton) {
      return;
    }
    if (!auth.puedeAccederAlPanel()) {
      cerrarEditor();
      mostrarMensaje('Debe iniciar sesión como personal', false);
      return;
    }

    objetoSeleccionado = inventario.obtenerObjetoPorId(Number(boton.dataset.cambiarEstado));
    if (!objetoSeleccionado) {
      return;
    }
    nombreObjeto.textContent = objetoSeleccionado.nombre;
    nuevoEstado.value = objetoSeleccionado.estado;
    nombre.value = objetoSeleccionado.reserva?.nombre || '';
    telefono.value = objetoSeleccionado.reserva?.telefono || '';
    correo.value = objetoSeleccionado.reserva?.correo || '';
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
    actualizarCamposReserva();
    editor.hidden = false;
    nuevoEstado.focus();
  });

  nuevoEstado.addEventListener('change', actualizarCamposReserva);
  cancelar.addEventListener('click', cerrarEditor);

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!objetoSeleccionado) {
      return;
    }
    const resultado = inventario.cambiarEstado(
      objetoSeleccionado.id,
      nuevoEstado.value,
      auth.puedeAccederAlPanel(),
      { nombre: nombre.value, telefono: telefono.value, correo: correo.value }
    );
    mostrarMensaje(resultado.mensaje, resultado.exito);
    if (resultado.exito) {
      cerrarEditor();
      actualizarCatalogos();
    } else if (!auth.puedeAccederAlPanel()) {
      cerrarEditor();
    }
  });
}
