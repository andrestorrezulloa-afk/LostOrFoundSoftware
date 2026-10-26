import InventarioObjetos from "./inventario.js";
import auth from "./auth-presenter.js";

const inventario = new InventarioObjetos();

const formObjeto = document.querySelector("#form-registrar-objeto");
const objNombre = document.querySelector("#obj-nombre");
const objCategoria = document.querySelector("#obj-categoria");
const objLugar = document.querySelector("#obj-lugar");
const objDescripcion = document.querySelector("#obj-descripcion");
const objFoto = document.querySelector("#obj-foto");
const mensajeObjeto = document.querySelector("#mensaje-objeto");

const listaCatalogoStaff = document.querySelector("#lista-catalogo-staff");
const listaCatalogoEstudiante = document.querySelector("#lista-catalogo-estudiante");
const catalogoEstudiante = document.querySelector('#catalogo-estudiante');
const detalleEstudiante = document.querySelector('#detalle-estudiante');
const detalleFoto = document.querySelector('#detalle-foto');
const detalleSinFoto = document.querySelector('#detalle-sin-foto');
const detalleNombre = document.querySelector('#detalle-nombre');
const detalleCategoria = document.querySelector('#detalle-categoria');
const detalleLugar = document.querySelector('#detalle-lugar');
const detalleDescripcion = document.querySelector('#detalle-descripcion');
const detalleEstado = document.querySelector('#detalle-estado');
const btnVolverCatalogo = document.querySelector('#btn-volver-catalogo');
let origenDetalle = null;

const btnVerCatalogoPublico = document.querySelector("#btn-ver-catalogo-publico");
const btnVolverLogin = document.querySelector("#btn-volver-login");
const seccionAuth = document.querySelector("#seccion-auth");
const vistaEstudiante = document.querySelector("#vista-estudiante");

const filtroCategoriaEstudiante = document.querySelector("#filtro-categoria-estudiante");
const filtroCategoriaStaff = document.querySelector("#filtro-categoria-staff");
const filtroNombreEstudiante = document.querySelector('#filtro-nombre-estudiante');

function mostrarMensajeObjeto(texto, esExito) {
  if (!mensajeObjeto) return;
  if (!texto) {
    mensajeObjeto.className = "mensaje";
    mensajeObjeto.innerHTML = "";
    return;
  }
  mensajeObjeto.innerHTML = texto;
  mensajeObjeto.className = esExito ? "mensaje exito" : "mensaje error";
}

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

function renderizarLista(lista, objetos, mensajeVacio, esPublico) {
  lista.replaceChildren(...(objetos.length
    ? objetos.map((objeto) => crearTarjetaObjeto(objeto, esPublico))
    : [crearElemento('p', 'catalogo-vacio', mensajeVacio)]));
}

function renderizarCatalogos() {
  if (listaCatalogoEstudiante) {
    const objetos = inventario.listar({
      nombre: filtroNombreEstudiante?.value,
      categoria: filtroCategoriaEstudiante?.value,
    });
    renderizarLista(listaCatalogoEstudiante, objetos, 'No se encontraron objetos que coincidan con la búsqueda.', true);
  }

  if (listaCatalogoStaff) {
    const objetos = inventario.listar({ categoria: filtroCategoriaStaff?.value });
    renderizarLista(listaCatalogoStaff, objetos, 'No hay objetos para esta categoría.', false);
  }
}

function cerrarDetalle(restaurarFoco = true) {
  detalleEstudiante.hidden = true;
  catalogoEstudiante.hidden = false;
  if (restaurarFoco) {
    (origenDetalle?.isConnected ? origenDetalle : filtroNombreEstudiante)?.focus();
  }
  origenDetalle = null;
}

if (listaCatalogoEstudiante) {
  listaCatalogoEstudiante.addEventListener('click', (event) => {
    const boton = event.target.closest('button[data-objeto-id]');
    if (!boton) {
      return;
    }
    const objeto = inventario.obtenerObjetoPorId(Number(boton.dataset.objetoId));
    if (!objeto) {
      return;
    }

    detalleNombre.textContent = objeto.nombre;
    detalleCategoria.textContent = objeto.categoria;
    detalleLugar.textContent = objeto.lugarEncontrado?.trim() || 'Lugar no especificado';
    detalleDescripcion.textContent = objeto.descripcion?.trim() || 'Sin descripción';
    detalleEstado.textContent = objeto.estado;
    detalleFoto.hidden = !objeto.foto;
    detalleSinFoto.hidden = Boolean(objeto.foto);
    if (objeto.foto) {
      detalleFoto.src = objeto.foto;
      detalleFoto.alt = `Foto de ${objeto.nombre}`;
    } else {
      detalleFoto.removeAttribute('src');
    }
    origenDetalle = boton;
    catalogoEstudiante.hidden = true;
    detalleEstudiante.hidden = false;
    detalleNombre.focus();
  });
}

if (btnVolverCatalogo) {
  btnVolverCatalogo.addEventListener('click', () => cerrarDetalle());
}

function leerArchivoComoBase64(archivo) {
  return new Promise((resolve) => {
    if (!archivo) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(archivo);
  });
}

if (formObjeto) {
  formObjeto.addEventListener("submit", async (event) => {
    event.preventDefault();
    const archivoFoto = objFoto.files && objFoto.files[0] ? objFoto.files[0] : null;
    const fotoBase64 = await leerArchivoComoBase64(archivoFoto);

    const res = inventario.registrarObjeto({
      nombre: objNombre.value,
      categoria: objCategoria.value,
      descripcion: objDescripcion.value,
      foto: fotoBase64,
      lugarEncontrado: objLugar.value,
      registradoPor: auth.obtenerUsuarioActual(),
    });

    if (res.exito) {
      formObjeto.reset();
      mostrarMensajeObjeto(res.mensaje, true);
      renderizarCatalogos();
    } else {
      mostrarMensajeObjeto(res.mensaje, false);
    }
  });
}

if (btnVerCatalogoPublico) {
  btnVerCatalogoPublico.addEventListener("click", () => {
    if (!detalleEstudiante.hidden) {
      cerrarDetalle(false);
    }
    renderizarCatalogos();
    seccionAuth.style.display = "none";
    vistaEstudiante.style.display = "block";
  });
}

if (btnVolverLogin) {
  btnVolverLogin.addEventListener("click", () => {
    if (!detalleEstudiante.hidden) {
      cerrarDetalle(false);
    }
    vistaEstudiante.style.display = "none";
    seccionAuth.style.display = "flex";
  });
}

if (filtroCategoriaEstudiante) {
  filtroCategoriaEstudiante.addEventListener("change", () => {
    renderizarCatalogos();
  });
}

if (filtroNombreEstudiante) {
  filtroNombreEstudiante.addEventListener('input', () => {
    renderizarCatalogos();
  });
}

if (filtroCategoriaStaff) {
  filtroCategoriaStaff.addEventListener("change", () => {
    renderizarCatalogos();
  });
}

renderizarCatalogos();
