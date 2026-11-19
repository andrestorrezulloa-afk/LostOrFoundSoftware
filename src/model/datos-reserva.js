export function validarDatosReserva(datos) {
  if (!datos.nombre?.trim()) {
    return 'Ingrese su nombre completo';
  }

  const telefono = datos.telefono?.trim() || '';
  const cantidadDigitos = telefono.replace(/\D/g, '').length;
  if (!/^\+?[\d\s()-]+$/.test(telefono) || cantidadDigitos < 7 || cantidadDigitos > 15) {
    return 'Ingrese un teléfono válido de 7 a 15 dígitos';
  }

  if (!/^[^\s@]+@(?:[a-z0-9-]+\.)*ucb\.edu\.bo$/i.test(datos.correo?.trim())) {
    return 'Ingrese un correo institucional válido de ucb.edu.bo';
  }
  return '';
}

export function prepararDatosReserva(datos) {
  return {
    nombre: datos.nombre.trim(),
    telefono: datos.telefono.trim(),
    correo: datos.correo.trim().toLowerCase(),
  };
}
