import renderizarSolicitudes from '../view/solicitudes-view.js';

export default function conectarReservasBienestar(inventario, auth, actualizarCatalogos) {
  const panel = document.querySelector('#panel-solicitudes-bienestar');
  const lista = document.querySelector('#lista-solicitudes-reserva');
  const mensaje = document.querySelector('#mensaje-solicitudes-bienestar');

  function actualizarSolicitudes() {
    const tieneSesion = auth.puedeAccederAlPanel();
    panel.hidden = !tieneSesion;
    if (!tieneSesion) {
      lista.replaceChildren();
      return;
    }
    const solicitudes = inventario.obtenerSolicitudesPendientes(tieneSesion).map((solicitud) => ({
      ...solicitud,
      nombreObjeto: inventario.obtenerObjetoPorId(solicitud.objetoId).nombre,
    }));
    renderizarSolicitudes(lista, solicitudes);
  }

  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-aceptar-solicitud]');
    if (!boton) {
      return;
    }
    const resultado = inventario.aceptarSolicitudReserva(
      Number(boton.dataset.aceptarSolicitud), auth.puedeAccederAlPanel()
    );
    mensaje.textContent = resultado.mensaje;
    mensaje.className = resultado.exito ? 'mensaje exito' : 'mensaje error';
    actualizarSolicitudes();
    if (resultado.exito) {
      actualizarCatalogos();
    }
  });

  // Los eventos de autenticación ya están conectados antes de estos listeners.
  document.querySelector('#login-form').addEventListener('submit', actualizarSolicitudes);
  document.querySelector('#btn-logout').addEventListener('click', () => {
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
    actualizarSolicitudes();
  });
  return actualizarSolicitudes;
}
