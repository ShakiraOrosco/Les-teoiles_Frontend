/**
 * Validaciones para Servicios y Usuarios
 * Todas devuelven string con mensaje de error o null si es válido
 */

// ---------------------- GENÉRICOS ----------------------

// Validar texto obligatorio, solo letras y espacios
export const validarTexto = (valor: string, nombreCampo = "El campo"): string | null => {
  if (valor.trim() === "") return `${nombreCampo} es obligatorio`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) return `${nombreCampo} solo puede contener letras y espacios`;
  return null;
};

// Validar longitud mínima y máxima
export const validarLongitud = (valor: string, min: number, max: number, nombreCampo = "El campo"): string | null => {
  if (valor.trim() === "") return `${nombreCampo} es obligatorio`;
  if (valor.length < min || valor.length > max) return `${nombreCampo} debe tener entre ${min} y ${max} caracteres`;
  return null;
};

// Validar descripción opcional
export const validarDescripcion = (valor: string | null, max: number, nombreCampo = "La descripción"): string | null => {
  if (valor && valor.length > max) return `${nombreCampo} no puede superar ${max} caracteres`;
  return null;
};

// Validar precio (decimal positivo, máximo 2 decimales)
export const validarPrecio = (
  precio: string,
  nombreCampo = "El precio",
  max = 999.99
): string | null => {
  const valor = precio.trim();
  if (!valor) return `${nombreCampo} es obligatorio`;

  // Reemplazar coma por punto para usuarios que escriben decimales con ,
  const num = Number(valor.replace(",", "."));
  if (isNaN(num)) return `${nombreCampo} debe ser un número válido`;
  if (num < 0) return `${nombreCampo} no puede ser negativo`;
  if (num < 1) return `${nombreCampo} no puede menor a 1`;
  if (num > max) return `${nombreCampo} no puede ser mayor a ${max}`;

  // Validar hasta 2 decimales
  if (!/^\d+(\.\d{1,2})?$/.test(valor)) return `${nombreCampo} solo puede tener 2 decimales`;

  return null;
};


// Validar teléfono boliviano (8 dígitos, comienza en 6 o 7)
export const validarTelefono = (telefono: string, nombreCampo = "El teléfono"): string | null => {
  if (telefono.trim() === "") return `${nombreCampo} es obligatorio`;
  if (!/^\d{8}$/.test(telefono)) return `${nombreCampo} debe tener 8 dígitos`;
  const num = Number(telefono);
  if (num < 60000000 || num > 79999999) return `${nombreCampo} debe ser válido`;
  return null;
};

// Validar correo electrónico
export const validarCorreo = (correo: string, nombreCampo = "El correo"): string | null => {
  if (correo.trim() === "") return `${nombreCampo} es obligatorio`;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) return `${nombreCampo} no es válido`;
  return null;
};

// Validar estado con opciones permitidas
export const validarEstado = (estado: string, opciones: string[], nombreCampo = "El estado"): string | null => {
  if (!estado) return `${nombreCampo} es obligatorio`;
  if (!opciones.includes(estado)) return `${nombreCampo} no es válido`;
  return null;
};

// ---------------------- ESPECÍFICOS USUARIO ----------------------

// Validar CI (solo números positivos, longitud 6 a 12 dígitos)
export const validarCI = (ci: string, nombreCampo = "El CI"): string | null => {
  if (ci.trim() === "") return `${nombreCampo} es obligatorio`;
  if (!/^\d+$/.test(ci)) return `${nombreCampo} solo puede contener números`;
  if (ci.length < 6 || ci.length > 12) return `${nombreCampo} debe tener entre 6 y 12 dígitos`;
  return null;
};

// Validar contraseña (entre 6 y 20 caracteres)
export const validarPassword = (password: string, nombreCampo = "La contraseña"): string | null => {
  if (password.trim() === "") return `${nombreCampo} es obligatoria`;
  if (password.length < 6 || password.length > 20) return `${nombreCampo} debe tener entre 6 y 20 caracteres`;
  return null;
};
