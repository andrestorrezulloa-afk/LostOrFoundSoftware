import SistemaAuth from "./auth.js";

describe("Autenticacion de Bienestar Estudiantil", () => {
  it("deberia registrar una cuenta con correo valido y contraseña", () => {
    const auth = new SistemaAuth();
    const resultado = auth.registrar("admin@ucb.edu.bo", "123456");
    expect(resultado.exito).toEqual(true);
  });
});