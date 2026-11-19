export default function renderizarResumenReserva(contenedor, objeto) {
  const foto = document.createElement(objeto.foto ? 'img' : 'div');
  foto.className = objeto.foto ? 'reserva-resumen-img' : 'objeto-sin-img';
  if (objeto.foto) {
    foto.src = objeto.foto;
    foto.alt = `Foto de ${objeto.nombre}`;
  } else {
    foto.textContent = 'Sin foto';
  }
  const categoria = document.createElement('p');
  categoria.className = 'badge-categoria';
  categoria.textContent = objeto.categoria;
  const nombre = document.createElement('h3');
  nombre.textContent = objeto.nombre;
  const campus = document.createElement('p');
  campus.className = 'objeto-lugar';
  campus.textContent = objeto.lugarEncontrado || 'Campus no especificado';
  contenedor.replaceChildren(foto, categoria, nombre, campus);
}
