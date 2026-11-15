function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

function crearTarjetaObjeto(obj, esPublico) {
  const tarjeta = crearElemento('article', 'objeto-card', '');
  if (obj.foto) {
    const imagen = crearElemento('img', 'objeto-img', '');
    imagen.src = obj.foto;
    imagen.alt = `Foto de ${obj.nombre}`;
    tarjeta.append(imagen);
  } else {
    tarjeta.append(crearElemento('div', 'objeto-sin-img', 'Sin foto'));
  }

  const cuerpo = crearElemento('div', 'objeto-body', '');
  const cabecera = crearElemento('div', 'objeto-header', '');
  cabecera.append(
    crearElemento('span', 'badge-categoria', obj.categoria),
    crearElemento('span', 'badge-estado', obj.estado)
  );
  cuerpo.append(
    cabecera,
    crearElemento('h3', 'objeto-titulo', obj.nombre),
    crearElemento('p', 'objeto-desc', obj.descripcion || 'Sin descripción adicional.'),
    crearElemento('small', 'objeto-fecha', `Registrado: ${obj.fechaRegistro}`)
  );
  if (esPublico) {
    const boton = crearElemento('button', 'btn-detalle', 'Ver detalle');
    boton.type = 'button';
    boton.dataset.objetoId = String(obj.id);
    boton.setAttribute('aria-label', `Ver detalle de ${obj.nombre}`);
    cuerpo.append(boton);
  }
  tarjeta.append(cuerpo);
  return tarjeta;
}

export function renderizarLista(lista, objetos, mensajeVacio, esPublico) {
  lista.replaceChildren(...(objetos.length
    ? objetos.map((objeto) => crearTarjetaObjeto(objeto, esPublico))
    : [crearElemento('p', 'catalogo-vacio', mensajeVacio)]));
}

