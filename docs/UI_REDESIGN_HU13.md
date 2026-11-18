# Rediseño de interfaz de HU-13

## Alcance confirmado

Se conserva el flujo vigente: nombre completo, teléfono y correo institucional;
Bienestar acepta la solicitud antes de que el objeto pase a Reservado.
No se modificaron los modelos, las validaciones, los estados ni la persistencia.

## Organización

Se usan vistas internas dentro de la misma página. Esto conserva las instancias
en memoria del inventario y la autenticación, y evita perderlas al navegar.
No se añadieron rutas, frameworks ni dependencias.

- **Inicio:** bienvenida, recuento de los tres estados y accesos rápidos.
- **Registrar objeto:** formulario independiente y orientación para publicar.
- **Gestionar objetos:** catálogo, campus, filtros y editor de estado existente.
- **Reservas:** solicitudes pendientes y reservas aceptadas con datos de contacto.

La navegación comprueba la sesión, identifica la sección activa con aria-current
y mueve el foco al título. Al cerrar sesión se ocultan las vistas y se retiran
los datos de las listas de reservas. La vista pública mantiene su catálogo y
sus filtros sin exigir inicio de sesión.

## Presentación

Paleta azul institucional, superficies neutras, bordes discretos y tipografía
del sistema. La hoja de estilos define una escala compartida para controles,
formularios, tarjetas y navegación, sin fuentes remotas ni efectos decorativos.

Los estados conservan texto y color: Disponible verde, Reservado azul y
Reclamado rojo. Las tarjetas separan datos, campus y acciones. Reservar tiene
mayor jerarquía que Ver detalle.

La reserva usa una sección dedicada en vez de un modal: muestra el objeto
seleccionado junto a los datos solicitados y explica la revisión por Bienestar.
Cancelar devuelve el foco al catálogo; enviar enfoca el mensaje de resultado.
La foto, categoría y campus del resumen se representan mediante una View.

El CSS adapta columnas, formularios y navegación a 1050, 760 y 420 píxeles.
En móvil, las cuatro secciones siguen visibles en una navegación compacta.
Los controles tienen foco visible y las etiquetas se mantienen asociadas.

## Archivos

- `index.html`: estructura de las vistas y contenido de orientación.
- `styles.css`: identidad visual, componentes compartidos y reglas responsive.
- `src/presenter/presenter.js`: conexión de la navegación administrativa.
- `src/presenter/panel-presenter.js`: navegación, sesión y resumen visual.
- `src/presenter/inventario-presenter.js`: exportación de la instancia existente.
- `src/presenter/reservas-bienestar-presenter.js`: presentación de reservas aceptadas.
- `src/presenter/reserva-estudiante-presenter.js`: resumen del objeto y foco.
- `src/view/catalogo-view.js`: organización de tarjetas y jerarquía de acciones.
- `src/view/reservas-aceptadas-view.js`: datos de contacto dentro del acceso del personal.
- `src/view/reserva-resumen-view.js`: objeto seleccionado durante la solicitud.
- Tres archivos nuevos de pruebas: `panel.test.js`, `reservas-aceptadas.test.js`
  y `reserva-presentacion.test.js`.

## Verificación

- Base original: 63 pruebas pasando.
- Resultado: 68 pruebas pasando, sin modificar las pruebas existentes.
- Cinco pruebas nuevas cubren navegación, autorización, resumen, reservas
  aceptadas y presentación del objeto durante la solicitud.
- Los comportamientos nuevos se comprobaron primero en rojo y después en verde
  mediante `npm test`; el registro se mantiene en `script/tdd_log.json`.
- La prueba existente del flujo completo conserva solicitud, aceptación,
  consulta pública y entrega sin reingresar los datos.
- Compilación de producción con Parcel y ESLint de los módulos revisados.
- HTML comprobado: IDs únicos, IDs anteriores conservados, etiquetas
  equilibradas y referencias de labels y aria-labelledby existentes.

## Limitación pendiente

No se pudo hacer la revisión visual en navegador ni comprobar visualmente los
tamaños responsive. Computer Use terminó la sesión porque no pudo determinar
la URL de Chrome con suficiente confianza. Las pruebas de eventos y del flujo
usan controles simulados y no sustituyen una revisión visual real.
