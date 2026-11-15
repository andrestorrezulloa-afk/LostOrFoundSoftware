#### Proyeto base para proyectos tddlab:

#### Creado a partir de proyecto usado en IngSoftware: parcel-jest-base

https://github.com/israelantezana/parcel-jest-base

#### Comandos creados en package json:

#### Para instalar las dependencias:

npm install

#### Comandos de uso:

Ejecutar web-sever local parcel:
npm start

Ejecutar pruebas de unidad de forma continua --watch:
npm test

Ejecutar pruebas de unidad solo una vez:
npm run test-once

## Arquitectura MVP

- `src/model/`: autenticación, inventario y filtros, sin dependencias del DOM.
- `src/view/catalogo-view.js`: creación de tarjetas y representación de listas, sin estado de negocio. `index.html` y `styles.css` conservan la estructura y estilos de la View en la raíz para Parcel.
- `src/presenter/`: eventos, navegación y coordinación entre Model y View. La entrada es `src/presenter/presenter.js`.
- Las pruebas del Model permanecen en `src/*.test.js`. Verificación sin alterar registros docentes: `npx jest --runInBand` y `npm run build`.
