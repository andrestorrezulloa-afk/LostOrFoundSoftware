export default function renderizarSolicitudes(lista, solicitudes) {
  const tarjetas = solicitudes.map((solicitud) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'solicitud-card';
    const informacion = [
      solicitud.nombreObjeto,
      `Nombre: ${solicitud.estudiante.nombre}`,
      `Teléfono: ${solicitud.estudiante.telefono}`,
      `Correo: ${solicitud.estudiante.correo}`,
    ];
    for (const texto of informacion) {
      const linea = document.createElement('p');
      linea.textContent = texto;
      tarjeta.append(linea);
    }
    const aceptar = document.createElement('button');
    aceptar.type = 'button';
    aceptar.className = 'btn-primary';
    aceptar.textContent = 'Aceptar reserva';
    aceptar.dataset.aceptarSolicitud = String(solicitud.id);
    aceptar.setAttribute('aria-label', `Aceptar reserva de ${solicitud.nombreObjeto} para ${solicitud.estudiante.nombre}`);
    tarjeta.append(aceptar);
    return tarjeta;
  });
  if (!tarjetas.length) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No hay solicitudes pendientes';
    tarjetas.push(mensaje);
  }
  lista.replaceChildren(...tarjetas);
}
