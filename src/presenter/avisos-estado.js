import SistemaAvisos from '../model/avisos.js';

// Una sola instancia compartida: el inventario publica y los estudiantes se suscriben.
const sistemaAvisos = new SistemaAvisos();

export default sistemaAvisos;