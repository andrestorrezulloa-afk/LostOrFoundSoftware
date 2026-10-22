import SistemaAuth from "./auth.js";

const auth = new SistemaAuth();

const regForm = document.querySelector("#registro-form");
const regCorreo = document.querySelector("#reg-correo");
const regPassword = document.querySelector("#reg-password");

const loginForm = document.querySelector("#login-form");
const loginCorreo = document.querySelector("#login-correo");
const loginPassword = document.querySelector("#login-password");

const btnLogout = document.querySelector("#btn-logout");
const mensajeSistema = document.querySelector("#mensaje-sistema");
const panelGestion = document.querySelector("#panel-gestion");
const seccionAuth = document.querySelector("#seccion-auth");
const estadoAcceso = document.querySelector("#estado-acceso");

function actualizarVista() {
  estadoAcceso.innerHTML = auth.obtenerEstadoPanel();
  if (auth.puedeAccederAlPanel()) {
    panelGestion.style.display = "block";
    seccionAuth.style.display = "none";
  } else {
    panelGestion.style.display = "none";
    seccionAuth.style.display = "block";
  }
}

if (regForm) {
  regForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const res = auth.registrar(regCorreo.value, regPassword.value);
    mensajeSistema.innerHTML = res.mensaje;
    if (res.exito) {
      regForm.reset();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const res = auth.iniciarSesion(loginCorreo.value, loginPassword.value);
    mensajeSistema.innerHTML = res.mensaje;
    actualizarVista();
  });
}

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    auth.cerrarSesion();
    mensajeSistema.innerHTML = "Sesion cerrada";
    actualizarVista();
  });
}