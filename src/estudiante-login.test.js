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
});