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

export function validarNumeroDel1Al9(value: string | number, fieldName: string): string {
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    
    if (isNaN(num)) return `${fieldName} debe ser un número`;
    if (!Number.isInteger(num)) return `${fieldName} debe ser un número entero`;
    if (num < 1 || num > 9) return `${fieldName} debe estar entre 1 y 9`;

    return ""; // válido
}


//Validar mas de tres caracteres repetidos
export const validarRepeticionCaracteres = (valor: string, nombreCampo = "El campo"): string | null => {
  const valorTrim = valor.trim();
  if (/(.)\1{3,}/.test(valorTrim)) {
    return `${nombreCampo} no puede tener más de 3 caracteres iguales consecutivos`;
  }
  return null;
};

//Validacion de solo digitos
// Valida que el número sea solo dígitos y tenga al menos 3 caracteres
export const validarNumeroEntero = (value: string): string => {
  if (!value) return "El número de habitación es obligatorio";
  if (!/^\d+$/.test(value)) return "El número debe contener solo dígitos";
  if (value.length < 3) return "El número debe tener al menos 3 dígitos";
  return "";
};

// Validar que un número no esté duplicado en un listado existente
// "listaExistente" es un array de strings con los números existentes
export const validarNoDuplicado = (
  valor: string,
  listaExistente: string[],
  nombreCampo = "El campo"
): string | null => {
  if (listaExistente.includes(valor)) {
    return `${nombreCampo} ya está registrado, no puede ser duplicado`;
  }
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

// ---------------------- VALIDACIONES FORMULARIO CONTACTO ----------------------

/**
 * Validar nombre completo para formulario de contacto
 * - Obligatorio (no vacío, no solo espacios)
 * - Solo letras, espacios y acentos
 * - Sin números ni símbolos
 * - Mínimo 3 caracteres
 * - Máximo 60 caracteres
 * - No permite caracteres repetitivos excesivos
 */
export const validarNombreContacto = (nombre: string): string | null => {
  const valorTrim = nombre.trim();
  
  // No vacío
  if (valorTrim === "") {
    return "El nombre es obligatorio";
  }
  
  // No solo espacios
  if (nombre.length > 0 && valorTrim === "") {
    return "El nombre no puede contener solo espacios";
  }
  
  // Mínimo 3 caracteres
  if (valorTrim.length < 3) {
    return "El nombre debe tener al menos 3 caracteres";
  }
  
  // Máximo 60 caracteres
  if (valorTrim.length > 60) {
    return "El nombre no puede superar 60 caracteres";
  }
  
  // Solo letras, espacios y acentos (sin números ni símbolos)
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valorTrim)) {
    return "El nombre solo puede contener letras y espacios";
  }
  
  // No permitir más de 3 caracteres iguales consecutivos
  if (/(.)\1{3,}/.test(valorTrim)) {
    return "El nombre no puede tener caracteres repetidos excesivamente";
  }
  
  // Debe tener al menos 2 letras diferentes
  const letrasUnicas = new Set(valorTrim.replace(/\s/g, '').toLowerCase());
  if (letrasUnicas.size < 2) {
    return "El nombre debe contener al menos 2 letras diferentes";
  }
  
  return null;
};

/**
 * Validar email para formulario de contacto
 * - Obligatorio
 * - Debe tener @
 * - Debe tener dominio (algo después del @)
 * - Debe tener extensión (.com, .edu, etc.)
 * - No acepta espacios
 * - Formato válido con símbolos permitidos (. _ -)
 * - Máximo 100 caracteres
 */
export const validarEmailContacto = (email: string): string | null => {
  const valorTrim = email.trim();
  
  // No vacío
  if (valorTrim === "") {
    return "El email es obligatorio";
  }
  
  // No acepta espacios dentro del email
  if (/\s/.test(email)) {
    return "El email no puede contener espacios";
  }
  
  // Longitud máxima
  if (valorTrim.length > 100) {
    return "El email no puede superar 100 caracteres";
  }
  
  // Debe tener @
  if (!valorTrim.includes("@")) {
    return "El email debe contener @";
  }
  
  // Validar formato completo: usuario@dominio.extensión
  // Permite letras, números, puntos, guiones y guiones bajos
  // No permite símbolos especiales al inicio o final
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(valorTrim)) {
    const partes = valorTrim.split("@");
    
    // Sin dominio
    if (partes.length < 2 || !partes[1] || partes[1].trim() === "") {
      return "El email debe tener un dominio después del @";
    }
    
    // Sin extensión
    if (!partes[1].includes(".") || partes[1].endsWith(".")) {
      return "El email debe tener una extensión válida (.com, .edu, etc.)";
    }
    
    return "El formato del email no es válido";
  }
  
  return null;
};

/**
 * Validar teléfono OPCIONAL para formulario de contacto
 * - Opcional (puede estar vacío)
 * - Si se llena: solo números
 * - No letras (ni letra 'e')
 * - No símbolos especiales
 * - Debe ser teléfono boliviano: 8 dígitos
 * - Debe comenzar con 6 o 7
 * - Rango: 60000000 - 79999999
 */
export const validarTelefonoContacto = (telefono: string): string | null => {
  const valorTrim = telefono.trim();
  
  // Si está vacío, es válido (campo opcional)
  if (valorTrim === "") {
    return null;
  }
  
  // Solo números (rechaza letras, incluyendo 'e')
  if (!/^\d+$/.test(valorTrim)) {
    return "El teléfono solo puede contener números";
  }
  
  // Debe tener exactamente 8 dígitos
  if (valorTrim.length !== 8) {
    return "El teléfono debe tener 8 dígitos";
  }
  
  // Validar rango boliviano (60000000 - 79999999)
  const num = Number(valorTrim);
  if (num < 60000000 || num > 79999999) {
    return "El teléfono debe ser un número boliviano válido (comenzar con 6 o 7)";
  }
  
  return null;
};

/**
 * Validar asunto del formulario de contacto
 * - Obligatorio
 * - Debe ser una opción válida del desplegable
 */
export const validarAsuntoContacto = (asunto: string): string | null => {
  const opcionesValidas = ["reserva", "hospedaje", "eventos", "tarifas", "otro"];
  
  if (!asunto || asunto.trim() === "") {
    return "Debe seleccionar un asunto";
  }
  
  if (!opcionesValidas.includes(asunto)) {
    return "El asunto seleccionado no es válido";
  }
  
  return null;
};

/**
 * Validar mensaje del formulario de contacto
 * - Obligatorio (no vacío, no solo espacios)
 * - Mínimo 10 caracteres
 * - Máximo 500 caracteres
 * - Acepta caracteres especiales, números y letras
 * - No permite caracteres repetitivos excesivos
 */
export const validarMensajeContacto = (mensaje: string): string | null => {
  const valorTrim = mensaje.trim();
  
  // No vacío
  if (valorTrim === "") {
    return "El mensaje es obligatorio";
  }
  
  // No solo espacios
  if (mensaje.length > 0 && valorTrim === "") {
    return "El mensaje no puede contener solo espacios";
  }
  
  // Mínimo 10 caracteres
  if (valorTrim.length < 10) {
    return "El mensaje debe tener al menos 10 caracteres";
  }
  
  // Máximo 500 caracteres
  if (valorTrim.length > 500) {
    return "El mensaje no puede superar 500 caracteres";
  }
  
  // No permitir más de 5 caracteres iguales consecutivos
  if (/(.)\1{5,}/.test(valorTrim)) {
    return "El mensaje no puede tener caracteres repetidos excesivamente";
  }
  
  // Debe tener al menos 3 caracteres diferentes (sin contar espacios)
  const caracteresUnicos = new Set(valorTrim.replace(/\s/g, '').toLowerCase());
  if (caracteresUnicos.size < 3) {
    return "El mensaje debe contener al menos 3 caracteres diferentes";
  }
  
  return null;
};

/*
 * Validar todo el formulario de contacto
 * Retorna un objeto con los errores de cada campo
 */
export const validarFormularioContacto = (formData: {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}) => {
  return {
    nombre: validarNombreContacto(formData.nombre),
    email: validarEmailContacto(formData.email),
    telefono: validarTelefonoContacto(formData.telefono),
    asunto: validarAsuntoContacto(formData.asunto),
    mensaje: validarMensajeContacto(formData.mensaje)
  };
};


/* -------- Validacion de haitacion ----------- */

// Obtiene el piso del primer dígito del número
export const obtenerPisoDesdeNumero = (numero: string): number => {
  return Number(numero[0] || 0);
};

// Validación completa para el formulario
export const validarFormularioHabitacion = (numero: string): Record<string, string> => {
  const errors: Record<string, string> = {};

  const errorNumero = validarNumeroEntero(numero);
  if (errorNumero) errors.numero = errorNumero;

  return errors;
}; 

export function validarNumeroHabitacion(num: string): string {
  const n = Number(num);
  if (isNaN(n) || !Number.isInteger(n)) {
    return "El número debe ser un valor entero";
  }
  if (n < 100 || n > 999) {
    return "El número debe estar entre 100 y 999";
  }
  return "";
}

