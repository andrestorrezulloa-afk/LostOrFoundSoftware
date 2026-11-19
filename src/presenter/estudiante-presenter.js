import LoginEstudiante from '../model/login-estudiante.js';

// Cuentas de demostracion del selector de Google (no hay backend OAuth real).
const CUENTAS_DEMO = {
  institucional: { correo: 'estudiante@ucb.edu.bo', nombre: 'Estudiante UCB' },
  ajena: { correo: 'visitante@gmail.com', nombre: 'Visita' },
};

let cuentaElegida = null;

const login = new LoginEstudiante({ proveedorGoogle: () => cuentaElegida });

const seccionAuth = document.querySelector('#seccion-auth');
const vistaEstudiante = document.querySelector('#vista-estudiante');
const mensajeSistema = document.querySelector('#mensaje-sistema');
const btnLoginGoogle = document.querySelector('#btn-login-google');
const vistaGoogle = document.querySelector('#vista-google');
const estudianteSesion = document.querySelector('#estudiante-sesion');
const estudianteActual = document.querySelector('#estudiante-actual');
const btnLogoutEstudiante = document.querySelector('#btn-logout-estudiante');

function mostrarMensaje(texto, esExito) {
  if (!mensajeSistema) {
    return;
  }
  if (!texto) {
    mensajeSistema.className = 'mensaje';
    mensajeSistema.textContent = '';
    return;
  }
  mensajeSistema.textContent = texto;
  mensajeSistema.className = esExito ? 'mensaje exito' : 'mensaje error';
}

function abrirSelectorGoogle() {
  if (vistaGoogle) {
    vistaGoogle.hidden = false;
  }
}

function iniciarConCuentaDemo(tipo) {
  cuentaElegida = CUENTAS_DEMO[tipo];
  const resultado = login.iniciarSesionConGoogle();
  if (vistaGoogle) {
    vistaGoogle.hidden = true;
  }
  if (resultado.exito) {
    actualizarVistaEstudiante();
    mostrarMensaje('', true);
  } else {
    mostrarMensaje(resultado.mensaje, false);
  }
}

function actualizarVistaEstudiante() {
  const estudiante = login.obtenerEstudianteActual();
  if (!estudiante) {
    if (estudianteSesion) {
      estudianteSesion.hidden = true;
    }
    if (estudianteActual) {
      estudianteActual.textContent = '';
    }
    return;
  }
  if (estudianteActual) {
    estudianteActual.textContent = estudiante.nombre;
  }
  if (estudianteSesion) {
    estudianteSesion.hidden = false;
  }
  if (seccionAuth) {
    seccionAuth.style.display = 'none';
  }
  if (vistaEstudiante) {
    vistaEstudiante.style.display = 'flex';
  }
}

function volverAlAcceso() {
  if (estudianteSesion) {
    estudianteSesion.hidden = true;
  }
  if (estudianteActual) {
    estudianteActual.textContent = '';
  }
  if (seccionAuth) {
    seccionAuth.style.display = 'flex';
  }
  if (vistaEstudiante) {
    vistaEstudiante.style.display = 'none';
  }
}

if (btnLoginGoogle) {
  btnLoginGoogle.addEventListener('click', abrirSelectorGoogle);
}

const btnCuentaInstitucional = document.querySelector('#google-cuenta-institucional');
if (btnCuentaInstitucional) {
  btnCuentaInstitucional.addEventListener('click', () => iniciarConCuentaDemo('institucional'));
}

const btnCuentaAjena = document.querySelector('#google-cuenta-ajena');
if (btnCuentaAjena) {
  btnCuentaAjena.addEventListener('click', () => iniciarConCuentaDemo('ajena'));
}

const btnCancelarGoogle = document.querySelector('#google-cancelar');
if (btnCancelarGoogle) {
  btnCancelarGoogle.addEventListener('click', () => {
    if (vistaGoogle) {
      vistaGoogle.hidden = true;
    }
  });
}

if (btnLogoutEstudiante) {
  btnLogoutEstudiante.addEventListener('click', () => {
    login.cerrarSesion();
    volverAlAcceso();
    mostrarMensaje('Sesión cerrada correctamente', true);
  });
}

export default login;