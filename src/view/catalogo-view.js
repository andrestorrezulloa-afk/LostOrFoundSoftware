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
  } else {
    const boton = crearElemento('button', 'btn-detalle', 'Cambiar estado');
    boton.type = 'button';
    boton.dataset.cambiarEstado = String(obj.id);
    boton.setAttribute('aria-label', `Cambiar estado de ${obj.nombre}`);
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

export function renderizarBanner(contenedor, objeto) {
  if (!contenedor) {
    return;
  }
  contenedor.hidden = !objeto;
  if (!objeto) {
    contenedor.replaceChildren();
    return;
  }
  const boton = crearElemento('button', 'banner-boton', '');
  boton.type = 'button';
  boton.dataset.objetoId = String(objeto.id);
  boton.setAttribute('aria-label', `Ver detalle del último objeto publicado: ${objeto.nombre}`);
  if (objeto.foto) {
    const imagen = crearElemento('img', 'banner-foto', '');
    imagen.src = objeto.foto;
    imagen.alt = `Foto de ${objeto.nombre}`;
    boton.append(imagen);
  } else {
    boton.append(crearElemento('div', 'banner-sin-foto', 'Sin foto'));
  }
  const contenido = crearElemento('div', 'banner-contenido', '');
  contenido.append(
    crearElemento('span', 'banner-etiqueta', 'Último objeto publicado'),
    crearElemento('h2', 'banner-nombre', objeto.nombre),
    crearElemento('p', 'banner-fecha', `Publicado: ${objeto.fechaRegistro}`),
    crearElemento('span', 'banner-enlace', 'Ver detalle →')
  );
  boton.append(contenido);
  contenedor.replaceChildren(boton);
}

