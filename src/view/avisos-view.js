function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

function etiquetaSuscripcion(activa) {
  return activa ? 'Suscripción activa' : 'Sin suscripción';
}

export function renderizarCategorias(contenedor, categorias, suscritas, alAlternar) {
  if (!contenedor) {
    return;
  }
  contenedor.replaceChildren();
  if (!categorias.length) {
    contenedor.append(crearElemento('p', 'avisos-vacio', 'No hay categorías disponibles.'));
    return;
  }
  for (const categoria of categorias) {
    const activa = suscritas.includes(categoria);
    const boton = crearElemento('button', `aviso-categoria${activa ? ' activa' : ''}`, '');
    boton.type = 'button';
    boton.dataset.categoria = categoria;
    boton.setAttribute('aria-pressed', String(activa));
    boton.append(
      crearElemento('span', 'aviso-nombre', categoria),
      crearElemento('span', 'aviso-estado', etiquetaSuscripcion(activa))
    );
    boton.addEventListener('click', () => alAlternar(categoria));
    contenedor.append(boton);
  }
}

export function renderizarAvisos(contenedor, avisos) {
  if (!contenedor) {
    return;
  }
  contenedor.replaceChildren();
  if (!avisos.length) {
    contenedor.append(
      crearElemento('p', 'avisos-vacio', 'Todavía no recibes avisos. Activa una categoría para empezar.')
    );
    return;
  }
  for (const aviso of avisos) {
    const tarjeta = crearElemento('article', 'aviso-card', '');
    tarjeta.append(
      crearElemento('span', 'aviso-etiqueta', `Nuevo objeto en ${aviso.categoria}`),
      crearElemento('strong', 'aviso-objeto', aviso.objeto.nombre),
      crearElemento('span', 'aviso-enlace', aviso.enlace),
      crearElemento('small', 'aviso-fecha', `Publicado: ${aviso.fecha}`)
    );
    contenedor.append(tarjeta);
  }
}