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

function crearTarjetaObjetoHTML(obj) {
  const imagenHTML = obj.foto
    ? `<img src="${obj.foto}" alt="${obj.nombre}" class="objeto-img" />`
    : `<div class="objeto-sin-img">Sin foto</div>`;

  return `
    <article class="objeto-card">
      ${imagenHTML}
      <div class="objeto-body">
        <div class="objeto-header">
          <span class="badge-categoria">${obj.categoria}</span>
          <span class="badge-estado">${obj.estado}</span>
        </div>
        <h3 class="objeto-titulo">${obj.nombre}</h3>
        <p class="objeto-desc">${obj.descripcion || "Sin descripción adicional."}</p>
        <small class="objeto-fecha">Registrado: ${obj.fechaRegistro}</small>
      </div>
    </article>
  `;
}

function renderizarCatalogos() {
  if (listaCatalogoEstudiante) {
    const objetos = inventario.listar({
      nombre: filtroNombreEstudiante?.value,
      categoria: filtroCategoriaEstudiante?.value,
    });
    listaCatalogoEstudiante.innerHTML = objetos.length === 0
      ? '<p class="catalogo-vacio">No se encontraron objetos que coincidan con la búsqueda.</p>'
      : objetos.map(crearTarjetaObjetoHTML).join('');
  }

  if (listaCatalogoStaff) {
    const objetos = inventario.listar({ categoria: filtroCategoriaStaff?.value });
    listaCatalogoStaff.innerHTML = objetos.length === 0
      ? '<p class="catalogo-vacio">No hay objetos para esta categoría.</p>'
      : objetos.map(crearTarjetaObjetoHTML).join('');
  }
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
    renderizarCatalogos();
    seccionAuth.style.display = "none";
    vistaEstudiante.style.display = "block";
  });
}

if (btnVolverLogin) {
  btnVolverLogin.addEventListener("click", () => {
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
