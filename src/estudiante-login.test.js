import LoginEstudiante from "./model/login-estudiante.js";

function cuentaGoogle(correo, nombre = "Estudiante Demo") {
  return { correo, nombre };
}

describe("HU-11: Acceder opcionalmente con cuenta institucional", () => {
  it("deberia iniciar sesion con una cuenta Google institucional e identificar la sesion del estudiante", () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => cuentaGoogle("estudiante@ucb.edu.bo"),
    });

    const resultado = login.iniciarSesionConGoogle();

    expect(resultado.exito).toEqual(true);
    expect(login.obtenerEstudianteActual()).toEqual({
      correo: "estudiante@ucb.edu.bo",
      nombre: "Estudiante Demo",
    });
  });

  it("no deberia habilitar funciones personalizadas con una cuenta ajena a los dominios institucionales", () => {
    const login = new LoginEstudiante({
      proveedorGoogle: () => cuentaGoogle("visitante@gmail.com"),
    });

    const resultado = login.iniciarSesionConGoogle();

    expect(resultado.exito).toEqual(false);
    expect(resultado.mensaje).toEqual(
      "Solo las cuentas con correo institucional (@ucb.edu.bo) pueden iniciar sesion"
    );
    expect(login.obtenerEstudianteActual()).toEqual(null);
    expect(login.puedeConfigurarAvisos()).toEqual(false);
  });
});