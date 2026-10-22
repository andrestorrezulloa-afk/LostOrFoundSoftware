import SistemaAuth from "./auth.js";

const auth = new SistemaAuth();

const seccionAuth = document.querySelector("#seccion-auth");
const vistaLogin = document.querySelector("#vista-login");
const vistaRegistro = document.querySelector("#vista-registro");
const panelGestion = document.querySelector("#panel-gestion");

const regForm = document.querySelector("#registro-form");
const regCorreo = document.querySelector("#reg-correo");
const regPassword = document.querySelector("#reg-password");

const loginForm = document.querySelector("#login-form");
const loginCorreo = document.querySelector("#login-correo");
const loginPassword = document.querySelector("#login-password");

const btnIrARegistro = document.querySelector("#ir-a-registro");
const btnIrALogin = document.querySelector("#ir-a-login");
const btnLogout = document.querySelector("#btn-logout");

const mensajeSistema = document.querySelector("#mensaje-sistema");
const estadoAcceso = document.querySelector("#estado-acceso");

function mostrarMensaje(texto, esExito) {
  if (!texto) {
    mensajeSistema.className = "mensaje";
    mensajeSistema.innerHTML = "";
    return;
  }
  mensajeSistema.innerHTML = texto;
  mensajeSistema.className = esExito ? "mensaje exito" : "mensaje error";
}

function irAVistaLogin(limpiarAlerta = true) {
  vistaRegistro.style.display = "none";
  vistaLogin.style.display = "block";
  if (limpiarAlerta) {
    mostrarMensaje("", false);
  }
}

function irAVistaRegistro() {
  vistaLogin.style.display = "none";
  vistaRegistro.style.display = "block";
  mostrarMensaje("", false);
}

function actualizarPantallaPrincipal() {
  estadoAcceso.innerHTML = auth.obtenerEstadoPanel();
  if (auth.puedeAccederAlPanel()) {
    seccionAuth.style.display = "none";
    panelGestion.style.display = "flex";
  } else {
    panelGestion.style.display = "none";
    seccionAuth.style.display = "flex";
  }
}

// Botón "¿No tienes una cuenta? Crear cuenta"
if (btnIrARegistro) {
  btnIrARegistro.addEventListener("click", (event) => {
    event.preventDefault();
    irAVistaRegistro();
  });
}

// Botón "¿Ya tienes una cuenta? Iniciar sesión"
if (btnIrALogin) {
  btnIrALogin.addEventListener("click", (event) => {
    event.preventDefault();
    irAVistaLogin(true);
  });
}

// Formulario de Crear Cuenta
if (regForm) {
  regForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const res = auth.registrar(regCorreo.value.trim(), regPassword.value);
    if (res.exito) {
      regForm.reset();
      irAVistaLogin(false); 
      mostrarMensaje(res.mensaje, true); 
    } else {
      mostrarMensaje(res.mensaje, false); 
    }
  });
}

// Formulario de Iniciar Sesión
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const res = auth.iniciarSesion(loginCorreo.value.trim(), loginPassword.value);
    if (res.exito) {
      loginForm.reset();
      mostrarMensaje("", true);
      actualizarPantallaPrincipal(); 
    } else {
      mostrarMensaje(res.mensaje, false);
    }
  });
}

// Botón Cerrar Sesión
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    auth.cerrarSesion();
    actualizarPantallaPrincipal();
    irAVistaLogin(false);
    mostrarMensaje("Sesión cerrada correctamente", true);
  });
}