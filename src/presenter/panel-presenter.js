const secciones = {
  inicio: { titulo: 'Inicio', descripcion: 'Una vista general para acompañar cada recuperación.' },
  registro: { titulo: 'Registrar objeto', descripcion: 'Publica un hallazgo para que su dueño pueda encontrarlo.' },
  objetos: { titulo: 'Gestionar objetos', descripcion: 'Consulta el catálogo y mantén actualizado cada estado.' },
  reservas: { titulo: 'Reservas', descripcion: 'Revisa solicitudes y coordina la entrega con los estudiantes.' },
};

export default function conectarPanel(inventario, auth) {
  const titulo = document.querySelector('#titulo-pagina-admin');
  const descripcion = document.querySelector('#descripcion-pagina-admin');
  const nombrePersonal = document.querySelector('#nombre-personal');

  function actualizarResumen() {
    const objetos = inventario.obtenerCatalogo();
    for (const [estado, id] of [
      ['Disponible', 'resumen-disponibles'],
      ['Reservado', 'resumen-reservados'],
      ['Reclamado', 'resumen-reclamados'],
    ]) {
      document.querySelector(`#${id}`).textContent = String(objetos.filter((objeto) => objeto.estado === estado).length);
    }
  }

  function mostrarSeccion(destino, enfocar = true) {
    if (!auth.puedeAccederAlPanel()) {
      return;
    }
    for (const seccion of Object.keys(secciones)) {
      document.querySelector(`#admin-${seccion}`).hidden = seccion !== destino;
      document.querySelector(`#nav-${seccion}`).setAttribute('aria-current', seccion === destino ? 'page' : 'false');
    }
    titulo.textContent = secciones[destino].titulo;
    descripcion.textContent = secciones[destino].descripcion;
    const usuario = auth.obtenerUsuarioActual();
    nombrePersonal.textContent = usuario.nombre || usuario.correo;
    actualizarResumen();
    if (enfocar) {
      titulo.focus();
    }
  }

  for (const seccion of Object.keys(secciones)) {
    document.querySelector(`#nav-${seccion}`).addEventListener('click', () => mostrarSeccion(seccion));
  }
  for (const [id, destino] of [
    ['acceso-registro', 'registro'], ['acceso-objetos', 'objetos'],
    ['acceso-reservas', 'reservas'], ['acceso-gestion-reservas', 'objetos'],
  ]) {
    document.querySelector(`#${id}`).addEventListener('click', () => mostrarSeccion(destino));
  }
  document.querySelector('#login-form').addEventListener('submit', () => mostrarSeccion('inicio', false));
  document.querySelector('#btn-logout').addEventListener('click', () => {
    for (const seccion of Object.keys(secciones)) {
      document.querySelector(`#admin-${seccion}`).hidden = true;
    }
    nombrePersonal.textContent = '';
  });
}
