export default function renderizarReservasAceptadas(lista, objetos) {
  const tarjetas = objetos.map((objeto) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'reserva-aceptada';
    const estado = document.createElement('span');
    estado.className = 'badge-estado estado-reservado';
    estado.textContent = objeto.estado;
    const titulo = document.createElement('h3');
    titulo.textContent = objeto.nombre;
    const campus = document.createElement('p');
    campus.className = 'objeto-lugar';
    campus.textContent = objeto.lugarEncontrado || 'Campus no especificado';
    const datos = document.createElement('dl');
    datos.className = 'datos-contacto';
    for (const [etiqueta, valor] of [
      ['Estudiante', objeto.reserva.nombre],
      ['Teléfono', objeto.reserva.telefono],
      ['Correo', objeto.reserva.correo],
    ]) {
      const termino = document.createElement('dt');
      termino.textContent = etiqueta;
      const contenido = document.createElement('dd');
      contenido.textContent = valor;
      datos.append(termino, contenido);
    }
    tarjeta.append(estado, titulo, campus, datos);
    return tarjeta;
  });
  if (!tarjetas.length) {
    const vacio = document.createElement('p');
    vacio.className = 'catalogo-vacio';
    vacio.textContent = 'No hay reservas en espera de entrega.';
    tarjetas.push(vacio);
  }
  lista.replaceChildren(...tarjetas);
}
