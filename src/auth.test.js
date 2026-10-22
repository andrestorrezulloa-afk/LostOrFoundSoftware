import SistemaAuth from "./auth.js";

describe("Autenticacion de Bienestar Estudiantil", () => {
  it("deberia registrar una cuenta con correo valido y contraseña", () => {
    const auth = new SistemaAuth();
    const resultado = auth.registrar("admin@ucb.edu.bo", "123456");
    expect(resultado.exito).toEqual(true);
  });

  it("deberia devolver mensaje de exito al crear la cuenta", () => {
    const auth = new SistemaAuth();
    const resultado = auth.registrar("admin@ucb.edu.bo", "123456");
    expect(resultado.mensaje).toEqual("Cuenta creada exitosamente");
  });

  it("no deberia registrar si el correo no es valido o falta contrasena", () => {
    const auth = new SistemaAuth();
    const resultado = auth.registrar("correoinvalido", "");
    expect(resultado.exito).toEqual(false);
    expect(resultado.mensaje).toEqual("Correo o contrasena invalidos");
  });

  it("no deberia permitir registrar un correo que ya existe", () => {
    const auth = new SistemaAuth();
    auth.registrar("admin@ucb.edu.bo", "123456");
    const segundoIntento = auth.registrar("admin@ucb.edu.bo", "otraClave");
    expect(segundoIntento.exito).toEqual(false);
    expect(segundoIntento.mensaje).toEqual("El correo ya esta registrado");
  });

  it("deberia iniciar sesion y dar acceso al panel con credenciales correctas", () => {
    const auth = new SistemaAuth();
    auth.registrar("admin@ucb.edu.bo", "123456");
    const login = auth.iniciarSesion("admin@ucb.edu.bo", "123456");
    expect(login.exito).toEqual(true);
    expect( auth.puedeAccederAlPanel() ).toEqual(true);
  });

  it("deberia mostrar error y negar acceso con credenciales incorrectas", () => {
    const auth = new SistemaAuth();
    auth.registrar("admin@ucb.edu.bo", "123456");
    const login = auth.iniciarSesion("admin@ucb.edu.bo", "claveErronea");
    expect(login.exito).toEqual(false);
    expect(login.mensaje).toEqual("Credenciales incorrectas");
    expect(auth.puedeAccederAlPanel()).toEqual(false);
  });

});