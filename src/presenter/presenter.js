import auth from './auth-presenter.js';
import { inventario } from './inventario-presenter.js';
import conectarPanel from './panel-presenter.js';

conectarPanel(inventario, auth);
