/**
 * Validaciones para Servicios y Usuarios
 * Todas devuelven string con mensaje de error o null si es válido
 */

export const validarLongitud = (valor: string, min: number, max: number, nombreCampo = "El campo"): string | null => {
  if (valor.trim() === "") return `${nombreCampo} es obligatorio`;
  if (valor.length < min || valor.length > max) return `${nombreCampo} debe tener entre ${min} y ${max} caracteres`;
  return null;
};

// Validar descripción opcional
export const validarDescripcion = (valor: string, min: number, max: number, nombreCampo = "La descripción"): string | null => {
  if (valor && valor.length < min || valor.length > max) return `${nombreCampo} no puede ser menos de ${min} ni superar ${max} caracteres`;
  return null;
};

export const validarNoSoloEspacios = (valor: string, nombreCampo = "El campo"): string | null => {
  if (valor.trim() === "") return `${nombreCampo} no puede estar vacío o solo contener espacios`;
  return null;
};

export const validarSoloLetras = (valor: string, nombreCampo = "El campo"): string | null => {
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
    return `${nombreCampo} solo puede contener letras y espacios`;
  }
  return null;
};

export const validarNumero = (
  valor: string,
  nombreCampo = "El campo",
  min = 0,
  max = 999.99
): string | null => {
  const trimmed = valor.trim();
  if (trimmed === "") return `${nombreCampo} es obligatorio`;

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return `${nombreCampo} debe ser un número válido con hasta 2 decimales`;
  }

  const numero = Number(trimmed);
  if (numero < min) return `${nombreCampo} no puede ser menor a ${min}`;
  if (numero > max) return `${nombreCampo} no puede ser mayor a ${max}`;

  return null;
};



// Validar precio (decimal positivo, máximo 2 decimales)
export const validarPrecio = (
  precio: string,
  nombreCampo = "El precio",
  min = 1.00,
  max = 999.99
): string | null => {
  const valor = precio.trim();
  if (!valor) return `${nombreCampo} es obligatorio`;

  // Reemplazar coma por punto para usuarios que escriben decimales con ,
  const num = Number(valor.replace(",", "."));
  if (isNaN(num)) return `${nombreCampo} debe ser un número válido`;
  if (num < 0) return `${nombreCampo} no puede ser negativo`;
  if (num < min) return `${nombreCampo} no puede menor a ${min}`;
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
  if (ci.length < 6 || ci.length > 9) return `${nombreCampo} debe tener entre 6 y 9 dígitos`;
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
  // Limpieza de espacios (igual que en el otro formulario)
  let valorFinal = nombre.replace(/^\s+/, ''); // Eliminar espacios al inicio
  valorFinal = valorFinal.replace(/\s{2,}/g, ' '); // Reemplazar múltiples espacios consecutivos por uno solo
  
  const valorTrim = valorFinal.trim();

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
  // Máximo 35 caracteres
  if (valorTrim.length > 35) {
    return "El nombre no puede superar 35 caracteres";
  }

  // Solo letras, espacios y acentos (sin números ni símbolos)
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valorTrim)) {
    return "El nombre solo puede contener letras y espacios y no caracteres especiales como ser ., /, #, etc.";
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

  // Validar que tenga al menos 2 palabras (nombre y apellido)
  const palabras = valorTrim.split(/\s+/).filter(palabra => palabra.length > 0);
  if (palabras.length < 2) {
    return "Por favor ingresa al menos un nombre y un apellido";
  }

  // Validar longitud mínima de palabras (evitar "a b" o "x y")
  const palabrasCortas = palabras.filter(palabra => palabra.length < 2);
  if (palabrasCortas.length > 0) {
    return "Cada nombre y apellido debe tener al menos 2 letras";
  }

  // Validar ratio vocales/consonantes para detectar texto sin sentido
  const soloLetras = valorTrim.replace(/\s/g, '');
  if (soloLetras.length > 3) {
    const vocales = soloLetras.match(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g) || [];
    const ratioVocales = vocales.length / soloLetras.length;
    
    // Si tiene menos del 25% de vocales, probablemente es texto aleatorio
    if (ratioVocales < 0.10) {
      return "El nombre debe contener vocales y ser legible";
    }
  }

  // Validar que no sean todas las palabras demasiado largas sin vocales suficientes
  const palabrasSinVocales = palabras.filter(palabra => {
    const vocalesEnPalabra = palabra.match(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g) || [];
    return vocalesEnPalabra.length === 0;
  });
  
  if (palabrasSinVocales.length > 0) {
    return "Cada palabra debe contener al menos una vocal";
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

  // No acepta espacios en ninguna parte del email
  if (/\s/.test(email)) {
    return "El email no puede contener espacios";
  }

  // Validar que solo tenga un @
  const arrobas = valorTrim.split("@").length - 1;
  if (arrobas !== 1) {
    return "El email debe contener exactamente un @";
  }

  // Longitud máxima 50 caracteres
  if (valorTrim.length > 50) {
    return "El email no puede superar 50 caracteres";
  }

  // Dividir en partes para validaciones específicas
  const partes = valorTrim.split("@");
  const usuario = partes[0];
  const dominioCompleto = partes[1];

  // Validar que el usuario no esté vacío
  if (usuario === "") {
    return "El email debe tener una parte antes del @";
  }

  // Validar que el dominio no esté vacío
  if (!dominioCompleto || dominioCompleto === "") {
    return "El email debe tener un dominio después del @";
  }

  // Validar que el dominio tenga extensión
  if (!dominioCompleto.includes(".") || dominioCompleto.endsWith(".")) {
    return "El email debe tener una extensión válida (.com, .edu, etc.)";
  }

  // ========== VALIDACIONES PARA EL USUARIO ==========

  // Validar formato del usuario: solo letras, números, ., -, _
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(usuario)) {
    return "La parte antes del @ solo puede contener letras, números, ., - y _";
  }

  // Validar que no tenga puntos consecutivos excesivos en el usuario
  if (/\.{2,}/.test(usuario)) {
    return "No se permiten puntos consecutivos antes del @";
  }

  // Validar que no sea un solo carácter antes del @
  if (usuario.length < 2) {
    return "La parte antes del @ debe tener al menos 2 caracteres";
  }

  // Validar que el usuario no sea texto sin sentido (como "Isknikvnk")
  if (usuario.length > 5) {
    const vocalesUsuario = usuario.match(/[aeiouAEIOU]/g) || [];
    const ratioVocalesUsuario = vocalesUsuario.length / usuario.length;
    
    // Si tiene menos del 15% de vocales, es probablemente texto aleatorio
    if (ratioVocalesUsuario < 0.15) {
      return "La parte antes del @ debe contener vocales y ser legible";
    }

    // Validar caracteres repetidos en el usuario
    if (/(.)\1{3,}/.test(usuario)) {
      return "No se permiten caracteres repetidos excesivamente antes del @";
    }
  }

  // ========== VALIDACIONES PARA EL DOMINIO COMPLETO ==========

  // Validar puntos consecutivos en el dominio completo (como "hot......juj")
  if (/\.{2,}/.test(dominioCompleto)) {
    return "No se permiten puntos consecutivos en el dominio";
  }

  // Validar formato del dominio completo
  const dominioPartes = dominioCompleto.split(".");
  const dominio = dominioPartes[0];
  const extension = dominioPartes.slice(1).join(".");

  // Validar que el dominio no esté vacío
  if (dominio === "") {
    return "El dominio del email no puede estar vacío";
  }

  // Validar que haya solo una extensión (evitar "hot......juj.com")
  if (dominioPartes.length > 2) {
    return "El dominio no puede contener múltiples extensiones";
  }

  // Validar formato del dominio: solo letras, números, -, .
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(dominio)) {
    return "El dominio solo puede contener letras, números, - y .";
  }

  // Validar que no tenga puntos o guiones consecutivos en el dominio
  if (/\.{2,}/.test(dominio) || /-{2,}/.test(dominio)) {
    return "No se permiten puntos o guiones consecutivos en el dominio";
  }

  // ========== VALIDACIONES PARA DOMINIOS VÁLIDOS ==========

  // 1. Validar longitud mínima y máxima del dominio
  if (dominio.length < 2) {
    return "El dominio debe tener al menos 2 caracteres";
  }
  if (dominio.length > 30) {
    return "El dominio es demasiado largo";
  }

  // 2. Validar que no sean caracteres repetidos consecutivos (más de 3)
  if (/(.)\1{3,}/.test(dominio)) {
    return "El dominio contiene caracteres repetidos excesivamente";
  }

  // 3. Validar números repetidos consecutivos (como 2000000000, 5615555555)
  if (/\d{5,}/.test(dominio)) {
    return "El dominio no puede contener tantos números consecutivos";
  }

  // 4. Validar ratio de vocales/consonantes para detectar texto sin sentido
  const soloLetrasDominio = dominio.replace(/[^a-zA-Z]/g, '');
  if (soloLetrasDominio.length >= 4) {
    const vocales = soloLetrasDominio.match(/[aeiouAEIOU]/g) || [];
    const ratioVocales = vocales.length / soloLetrasDominio.length;
    
    // Si tiene menos del 20% de vocales, probablemente es texto aleatorio
    if (ratioVocales < 0.2) {
      return "El dominio debe contener vocales y ser legible";
    }
  }

  // 5. Validar que tenga al menos 2 caracteres diferentes para dominios
  const caracteresUnicos = new Set(dominio.toLowerCase());
  if (caracteresUnicos.size < 2 && dominio.length > 3) {
    return "El dominio debe contener al menos 2 caracteres diferentes";
  }

  // 6. Validar ratio de unicidad (evitar "aaaaa", "lllll", etc.)
  const ratioUnicidad = caracteresUnicos.size / dominio.length;
  if (dominio.length > 4 && ratioUnicidad < 0.5) {
    return "El dominio es demasiado repetitivo";
  }

  // 7. Validar que no sean solo consonantes consecutivas sin vocales
  if (/^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}$/.test(dominio)) {
    return "El dominio debe contener vocales";
  }

  // 8. Validar extensión del dominio
  if (!/^[a-zA-Z]{2,}$/.test(extension)) {
    return "La extensión del email debe contener solo letras (ej: .com, .org)";
  }

  // 9. Validar longitud de la extensión
  if (extension.length < 2 || extension.length > 6) {
    return "La extensión debe tener entre 2 y 6 caracteres";
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
  // Limpieza inicial de espacios (igual que en nombre)
  let valorFinal = mensaje.replace(/^\s+/, ''); // Eliminar espacios al inicio
  valorFinal = valorFinal.replace(/\s{2,}/g, ' '); // Reemplazar múltiples espacios consecutivos por uno solo
  
  const valorTrim = valorFinal.trim();

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

  // Validar que tenga al menos 3 palabras (para evitar texto sin sentido)
  const palabras = valorTrim.split(/\s+/).filter(palabra => palabra.length > 0);
  if (palabras.length < 3) {
    return "El mensaje debe contener al menos 3 palabras";
  }

  // Validar que las palabras tengan longitud mínima (evitar "a b c")
  const palabrasCortas = palabras.filter(palabra => palabra.length < 2);
  if (palabrasCortas.length > palabras.length / 2) {
    return "El mensaje debe contener palabras más significativas";
  }

  // Debe tener al menos 5 caracteres diferentes (sin contar espacios)
  const caracteresUnicos = new Set(valorTrim.replace(/\s/g, '').toLowerCase());
  if (caracteresUnicos.size < 5) {
    return "El mensaje debe contener al menos 5 caracteres diferentes";
  }

  // Validar que no sea principalmente caracteres aleatorios (ratio vocales/consonantes)
  const soloLetras = valorTrim.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
  if (soloLetras.length > 10) {
    const vocales = soloLetras.match(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g) || [];
    const ratioVocales = vocales.length / soloLetras.length;
    
    // Si tiene menos del 20% de vocales, probablemente es texto sin sentido
    if (ratioVocales < 0.2) {
      return "El mensaje debe ser comprensible y contener vocales";
    }
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

  if (n < 100 || n > 915) {
    return "El número debe estar entre 100 y 915";
  }

  // Verifica que sea múltiplo de 100 + 0–15
  const piso = Math.floor(n / 100);
  const habitacion = n % 100;

  if (habitacion < 0 || habitacion > 15) {
    return `En el piso ${piso}, el número de habitación debe estar entre ${piso}00 y ${piso}15`;
  }

  return "";
}


/**
 * Validaciones para Formulario de Hospedaje
 * Adaptadas de las validaciones existentes de contacto
 */

// ---------------------- VALIDACIÓN DE NOMBRE ----------------------
export const validarNombreHospedaje = (nombre: string): string | null => {
  const valorTrim = nombre.trim();

  if (valorTrim === "") {
    return "El nombre es obligatorio";
  }

  if (nombre.length > 0 && valorTrim === "") {
    return "El nombre no puede contener solo espacios";
  }

  if (valorTrim.length < 3) {
    return "El nombre debe tener al menos 3 caracteres";
  }
  
  if (valorTrim.length > 35) {
    return "El nombre no puede superar 35 caracteres";
  }

  // Nueva validación: no permitir caracteres especiales ni números
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(valorTrim)) {
    return "El nombre no puede contener números ni caracteres especiales";
  }

  //***************************************************************************************** */
  // ✨ NUEVAS VALIDACIONES PARA ESPACIOS ✨
  
  // No permitir espacios al inicio o final después del trim
  // (esto valida el string original)
  if (nombre !== valorTrim) {
    return "El nombre no puede tener espacios al inicio o al final";
  }
  
  // No permitir espacios múltiples consecutivos
  if (/\s{2,}/.test(valorTrim)) {
    return "El nombre no puede tener espacios consecutivos";
  }
  
  // No permitir espacios entre caracteres individuales (como "J o s u e")
  // Detecta cuando hay palabras de una sola letra (excepto al inicio)
  const palabras = valorTrim.split(/\s+/);
  const palabrasDeUnaLetra = palabras.filter((p, idx) => 
    p.length === 1 && idx > 0
  );
  
  if (palabrasDeUnaLetra.length > 0) {
    return "El nombre no puede tener letras separadas por espacios";
  }
  
  // No permitir que una palabra termine con una letra seguida de espacio y otra letra sola
  // (como "maria s")
  if (/\b\w+\s+\w\b/.test(valorTrim)) {
    return "El nombre no puede tener letras sueltas";
  }
  

//****************************************************************************************************   */


  if (/(.)\1{3,}/.test(valorTrim)) {
    return "El nombre no puede tener caracteres repetidos excesivamente";
  }

  const letrasUnicas = new Set(valorTrim.replace(/\s/g, '').toLowerCase());
  if (letrasUnicas.size < 2) {
    return "El nombre debe contener al menos 2 letras diferentes";
  }

  return null;
};


// ---------------------- VALIDACIÓN DE APELLIDOS ----------------------
export const validarApellidos = (apellidoPaterno: string, apellidoMaterno: string): { paterno: string | null; materno: string | null } => {
  const paternoTrim = apellidoPaterno.trim();
  const maternoTrim = apellidoMaterno.trim();

  const errores = { paterno: null as string | null, materno: null as string | null };

  // Al menos uno debe estar lleno
  if (paternoTrim === "" && maternoTrim === "") {
    return { paterno: "Debe llenar al menos un apellido", materno: null };
  }

  // Validar apellido paterno si está lleno
  if (paternoTrim !== "") {
    if (paternoTrim.length < 3) {
      errores.paterno = "Apellido paterno debe tener al menos 3 caracteres";
    } else if (paternoTrim.length > 25) {
      errores.paterno = "Apellido paterno no puede superar 25 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(paternoTrim)) {
      errores.paterno = "Solo puede contener letras y espacios";
    } else if (/(.)\1{3,}/.test(paternoTrim)) {
      errores.paterno = "No puede tener caracteres repetidos excesivamente";
    } else {
      const letrasUnicas = new Set(paternoTrim.replace(/\s/g, '').toLowerCase());
      if (letrasUnicas.size < 2) {
        errores.paterno = "Debe contener al menos 2 letras diferentes";
      }
    }
  }

  // Validar apellido materno si está lleno
  if (maternoTrim !== "") {
    if (maternoTrim.length < 3) {
      errores.materno = "Apellido materno debe tener al menos 3 caracteres";
    } else if (maternoTrim.length > 25) {
      errores.materno = "Apellido materno no puede superar 25 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(maternoTrim)) {
      errores.materno = "Solo puede contener letras y espacios";
    } else if (/(.)\1{3,}/.test(maternoTrim)) {
      errores.materno = "No puede tener caracteres repetidos excesivamente";
    } else {
      const letrasUnicas = new Set(maternoTrim.replace(/\s/g, '').toLowerCase());
      if (letrasUnicas.size < 2) {
        errores.materno = "Debe contener al menos 2 letras diferentes";
      }
    }
  }

  return errores;
};

// ---------------------- VALIDACIÓN DE EMAIL MEJORADA ----------------------
export const validarEmailHospedaje = (email: string): string | null => {
  const valorTrim = email.trim();
  
  // No vacío
  if (valorTrim === "") {
    return "El email es obligatorio";
  }

  // No acepta espacios en ninguna parte del email
  if (/\s/.test(email)) {
    return "El email no puede contener espacios";
  }

  // Validar que solo tenga un @
  const arrobas = valorTrim.split("@").length - 1;
  if (arrobas !== 1) {
    return "El email debe contener exactamente un @";
  }

  // Longitud máxima 50 caracteres
  if (valorTrim.length > 50) {
    return "El email no puede superar 50 caracteres";
  }

  // Dividir en partes para validaciones específicas
  const partes = valorTrim.split("@");
  const usuario = partes[0];
  const dominioCompleto = partes[1];

  // Validar que el usuario no esté vacío
  if (usuario === "") {
    return "El email debe tener una parte antes del @";
  }

  // Validar que el dominio no esté vacío
  if (!dominioCompleto || dominioCompleto === "") {
    return "El email debe tener un dominio después del @";
  }

  // Validar que el dominio tenga extensión
  if (!dominioCompleto.includes(".") || dominioCompleto.endsWith(".")) {
    return "El email debe tener una extensión válida (.com, .edu, etc.)";
  }

  // ========== VALIDACIONES PARA EL USUARIO ==========

  // Validar formato del usuario: solo letras, números, ., -, _
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(usuario)) {
    return "La parte antes del @ solo puede contener letras, números, ., - y _";
  }

  // Validar que no tenga puntos consecutivos excesivos en el usuario
  if (/\.{2,}/.test(usuario)) {
    return "No se permiten puntos consecutivos antes del @";
  }

  // Validar que no sea un solo carácter antes del @
  if (usuario.length < 2) {
    return "La parte antes del @ debe tener al menos 2 caracteres";
  }

  // Validar que el usuario no sea texto sin sentido (como "Isknikvnk")
  if (usuario.length > 5) {
    const vocalesUsuario = usuario.match(/[aeiouAEIOU]/g) || [];
    const ratioVocalesUsuario = vocalesUsuario.length / usuario.length;
    
    // Si tiene menos del 15% de vocales, es probablemente texto aleatorio
    if (ratioVocalesUsuario < 0.15) {
      return "La parte antes del @ debe contener vocales y ser legible";
    }

    // Validar caracteres repetidos en el usuario
    if (/(.)\1{3,}/.test(usuario)) {
      return "No se permiten caracteres repetidos excesivamente antes del @";
    }
  }

  // ========== VALIDACIONES PARA EL DOMINIO COMPLETO ==========

  // Validar puntos consecutivos en el dominio completo (como "hot......juj")
  if (/\.{2,}/.test(dominioCompleto)) {
    return "No se permiten puntos consecutivos en el dominio";
  }

  // Validar formato del dominio completo
  const dominioPartes = dominioCompleto.split(".");
  const dominio = dominioPartes[0];
  const extension = dominioPartes.slice(1).join(".");

  // Validar que el dominio no esté vacío
  if (dominio === "") {
    return "El dominio del email no puede estar vacío";
  }

  // Validar que haya solo una extensión (evitar "hot......juj.com")
  if (dominioPartes.length > 2) {
    return "El dominio no puede contener múltiples extensiones";
  }

  // Validar formato del dominio: solo letras, números, -, .
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(dominio)) {
    return "El dominio solo puede contener letras, números, - y .";
  }

  // Validar que no tenga puntos o guiones consecutivos en el dominio
  if (/\.{2,}/.test(dominio) || /-{2,}/.test(dominio)) {
    return "No se permiten puntos o guiones consecutivos en el dominio";
  }

  // ========== VALIDACIONES PARA DOMINIOS VÁLIDOS ==========

  // 1. Validar longitud mínima y máxima del dominio
  if (dominio.length < 2) {
    return "El dominio debe tener al menos 2 caracteres";
  }
  if (dominio.length > 30) {
    return "El dominio es demasiado largo";
  }

  // 2. Validar que no sean caracteres repetidos consecutivos (más de 3)
  if (/(.)\1{3,}/.test(dominio)) {
    return "El dominio contiene caracteres repetidos excesivamente";
  }

  // 3. Validar números repetidos consecutivos (como 2000000000, 5615555555)
  if (/\d{5,}/.test(dominio)) {
    return "El dominio no puede contener tantos números consecutivos";
  }

  // 4. Validar ratio de vocales/consonantes para detectar texto sin sentido
  const soloLetrasDominio = dominio.replace(/[^a-zA-Z]/g, '');
  if (soloLetrasDominio.length >= 4) {
    const vocales = soloLetrasDominio.match(/[aeiouAEIOU]/g) || [];
    const ratioVocales = vocales.length / soloLetrasDominio.length;
    
    // Si tiene menos del 20% de vocales, probablemente es texto aleatorio
    if (ratioVocales < 0.2) {
      return "El dominio debe contener vocales y ser legible";
    }
  }

  // 5. Validar que tenga al menos 2 caracteres diferentes para dominios
  const caracteresUnicos = new Set(dominio.toLowerCase());
  if (caracteresUnicos.size < 2 && dominio.length > 3) {
    return "El dominio debe contener al menos 2 caracteres diferentes";
  }

  // 6. Validar ratio de unicidad (evitar "aaaaa", "lllll", etc.)
  const ratioUnicidad = caracteresUnicos.size / dominio.length;
  if (dominio.length > 4 && ratioUnicidad < 0.5) {
    return "El dominio es demasiado repetitivo";
  }

  // 7. Validar que no sean solo consonantes consecutivas sin vocales
  if (/^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}$/.test(dominio)) {
    return "El dominio debe contener vocales";
  }

  // 8. Validar extensión del dominio
  if (!/^[a-zA-Z]{2,}$/.test(extension)) {
    return "La extensión del email debe contener solo letras (ej: .com, .org)";
  }

  // 9. Validar longitud de la extensión
  if (extension.length < 2 || extension.length > 6) {
    return "La extensión debe tener entre 2 y 6 caracteres";
  }

  return null;
};

// ---------------------- VALIDACIÓN DE TELÉFONO ----------------------
export const validarTelefonoHospedaje = (telefono: string): string | null => {
  const valorTrim = telefono.trim();
  
  if (valorTrim === "") 
    return "El teléfono es obligatorio";
  
  // No permitir espacios o caracteres especiales
  if (/[^0-9]/.test(valorTrim)) {
    return "El teléfono no puede contener espacios ni caracteres especiales";
  }

  if (!/^\d+$/.test(valorTrim)) {
    return "El teléfono solo puede contener números";
  }

  if (valorTrim.length !== 8) {
    return "El teléfono debe tener 8 dígitos";
  }

  const num = Number(valorTrim);
  if (num < 60000000 || num > 79999999) {
    return "El teléfono debe ser un número boliviano válido (comenzar con 6 o 7)";
  }

  return null;
};

// ---------------------- VALIDACIÓN DE CARNET ----------------------
export const validarCarnetHospedaje = (carnet: string): string | null => {
  const valorTrim = carnet.trim();

  if (valorTrim === "") return "El carnet es obligatorio";


  // ✨ NUEVA: Validar que no tenga espacios en ninguna parte
  if (/\s/.test(carnet)) {
    return "El carnet no puede contener espacios";
  }
  
  // ✨ NUEVA: Validar espacios al inicio o final (comparando original con trim)
  if (carnet !== valorTrim) {
    return "El carnet no puede tener espacios al inicio o al final";
  }


  if (!/^\d+$/.test(valorTrim)) {
    return "El carnet solo puede contener números y no caracteres especiales como ser .,´, /, #, etc.";
  }

  // No puede empezar con 0
  if (valorTrim.startsWith('0')) {
    return "El carnet no puede comenzar con 0";
  }
  
  if (valorTrim.length < 6 || valorTrim.length > 9) {
    return "El carnet debe tener entre 6 y 9 dígitos";
  }

  return null;
};

// ---------------------- VALIDACIÓN DE CANTIDAD DE PERSONAS ----------------------
export const validarCantidadPersonas = (cantidad: string): string | null => {
  if (cantidad === "") return "La cantidad de personas es obligatoria";

  const num = Number(cantidad);
  if (isNaN(num)) return "Debe ser un número válido";
  if (!Number.isInteger(num)) return "Debe ser un número entero";
  if (num < 1) return "Debe ser al menos 1 persona";
  if (num > 5) return "El máximo permitido es 5 personas";

  return null;
};

// ---------------------- VALIDACIÓN DE FECHAS ----------------------
export const validarFechas = (fechaInicio: string, fechaFin: string): { inicio: string | null; fin: string | null } => {
  const errores = { inicio: null as string | null, fin: null as string | null };

  if (!fechaInicio) errores.inicio = "La fecha de inicio es obligatoria";
  if (!fechaFin) errores.fin = "La fecha de fin es obligatoria";

  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    // ✅ DEBUG: Agrega estos console.log temporalmente
    console.log('=== DEBUG VALIDACIÓN FECHAS ===');
    console.log('Hoy:', hoy);
    console.log('Mañana:', manana);
    console.log('Inicio recibido:', fechaInicio);
    console.log('Inicio parseado:', inicio);
    console.log('¿Inicio < Mañana?:', inicio < manana);
    console.log('Comparación en milisegundos:');
    console.log('  inicio.getTime():', inicio.getTime());
    console.log('  manana.getTime():', manana.getTime());
    console.log('================================');

    const maxInicio = new Date(hoy);
    maxInicio.setFullYear(maxInicio.getFullYear() + 3);

    if (inicio >manana) {
      errores.inicio = "La fecha de inicio debe ser al menos un día después de hoy";
    } else if (inicio > maxInicio) {
      errores.inicio = "La fecha de inicio no puede ser mayor a 3 años desde hoy";
    }

    if (errores.inicio === null) {
      const minFin = new Date(inicio);
      minFin.setDate(minFin.getDate() + 1);

      const maxFin = new Date(inicio);
      maxFin.setFullYear(maxFin.getFullYear() + 3);

      if (fin < minFin) {
        errores.fin = "La fecha de fin debe ser al menos un día después de la fecha de inicio";
      } else if (fin > maxFin) {
        errores.fin = "La fecha de fin no puede ser mayor a 3 años desde la fecha de inicio";
      }
    }
  }

  return errores;
};
// ---------------------- VALIDAR TODO EL FORMULARIO ----------------------
export const validarFormularioHospedaje = (formData: {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  carnet: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: string;
}): Record<string, string | null> => {
  const erroresApellidos = validarApellidos(formData.apellidoPaterno, formData.apellidoMaterno);
  const erroresFechas = validarFechas(formData.fechaInicio, formData.fechaFin);

  return {
    nombre: validarNombreHospedaje(formData.nombre),
    apellidoPaterno: erroresApellidos.paterno,
    apellidoMaterno: erroresApellidos.materno,
    telefono: validarTelefonoHospedaje(formData.telefono),
    email: validarEmailHospedaje(formData.email),
    carnet: validarCarnetHospedaje(formData.carnet),
    fechaInicio: erroresFechas.inicio,
    fechaFin: erroresFechas.fin,
    cantidadPersonas: validarCantidadPersonas(formData.cantidadPersonas),
  };
};

// ---------------------- UTILIDADES PARA INPUTS ----------------------

// Permitir solo números y bloquear letras
export const soloNumeros = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const tecla = e.key;
  if (
    !/[0-9]/.test(tecla) &&
    !['Backspace', 'Delete', 'Tab', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(tecla) &&
    !(e.ctrlKey && ['a', 'c', 'v', 'x'].includes(tecla.toLowerCase()))
  ) {
    e.preventDefault();
  }
};

// Permitir solo letras y espacios (muy restrictivo, bloquea caracteres especiales)
export const soloLetras = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const tecla = e.key;
  const esLetra = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(tecla);
  const esTeclaEspecial = ['Backspace', 'Delete', 'Tab', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(tecla);
  const esControl = e.ctrlKey && ['a', 'c', 'v', 'x'].includes(tecla.toLowerCase());

  if (!esLetra && !esTeclaEspecial && !esControl) {
    e.preventDefault();
  }
};

// Validar que el texto tenga estructura real (no solo consonantes o caracteres aleatorios)
export const validarEstructuraTexto = (texto: string): boolean => {
  const textoLimpio = texto.toLowerCase().replace(/\s/g, '');

  // Si es muy corto, permitir
  if (textoLimpio.length < 3) return true;

  // Contar vocales
  const vocales = (textoLimpio.match(/[aeiouáéíóú]/g) || []).length;

  // Debe tener al menos 20% de vocales (nombres reales tienen vocales)
  const porcentajeVocales = (vocales / textoLimpio.length) * 100;

  return porcentajeVocales >= 15;
};

// Bloquear notación científica y caracteres especiales en números
export const bloquearEscrituraDirecta = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
    e.preventDefault();
  }
};


/**
 * Validaciones para Formulario de Reserva de Eventos
 * Todas devuelven string con mensaje de error o null si es válido
 */

// ===================== VALIDACIÓN DE NOMBRE =====================
export const validarNombreEvento = (nombre: string): string | null => {
  const valorTrim = nombre.trim();

  if (valorTrim === "") {
    return "El nombre es obligatorio";
  }

  if (nombre.length > 0 && valorTrim === "") {
    return "El nombre no puede contener solo espacios";
  }

  if (valorTrim.length < 3) {
    return "El nombre debe tener al menos 3 caracteres";
  }
  
  if (valorTrim.length > 35) {
    return "El nombre no puede superar 35 caracteres";
  }

  // Nueva validación: no permitir caracteres especiales ni números
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(valorTrim)) {
    return "El nombre no puede contener números ni caracteres especiales";
  }

  if (/(.)\1{1,}/.test(valorTrim)) {
    return "El nombre no puede tener caracteres repetidos excesivamente";
  }

  const letrasUnicas = new Set(valorTrim.replace(/\s/g, '').toLowerCase());
  if (letrasUnicas.size < 2) {
    return "El nombre debe contener al menos 2 letras diferentes";
  }

  return null;
};


// ===================== VALIDACIÓN DE APELLIDOS =====================
export const validarApellidosEvento = (
  apellidoPaterno: string, 
  apellidoMaterno: string
): { paterno: string | null; materno: string | null } => {
  const paternoTrim = apellidoPaterno.trim();
  const maternoTrim = apellidoMaterno.trim();

  const errores = { paterno: null as string | null, materno: null as string | null };

  // Al menos uno debe estar lleno
  if (paternoTrim === "" && maternoTrim === "") {
    return { paterno: "Debe llenar al menos un apellido", materno: null };
  }

  // Validar apellido paterno si está lleno
  if (paternoTrim !== "") {
    if (paternoTrim.length < 3) {
      errores.paterno = "Debe tener al menos 3 caracteres";
    } else if (paternoTrim.length > 50) {
      errores.paterno = "No puede superar 50 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(paternoTrim)) {
      errores.paterno = "Solo puede contener letras y espacios";
    } else if (/(.)\1{3,}/.test(paternoTrim)) {
      errores.paterno = "No puede tener más de 3 caracteres iguales consecutivos";
    }
  }

  // Validar apellido materno si está lleno
  if (maternoTrim !== "") {
    if (maternoTrim.length < 3) {
      errores.materno = "Debe tener al menos 3 caracteres";
    } else if (maternoTrim.length > 50) {
      errores.materno = "No puede superar 50 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(maternoTrim)) {
      errores.materno = "Solo puede contener letras y espacios";
    } else if (/(.)\1{3,}/.test(maternoTrim)) {
      errores.materno = "No puede tener más de 3 caracteres iguales consecutivos";
    }
  }

  return errores;
};

// ===================== VALIDACIÓN DE TELÉFONO =====================
export const validarTelefonoEvento = (telefono: string): string | null => {
  const valorTrim = telefono.trim();
  
   
  if (valorTrim === "") 
    return "El teléfono es obligatorio";
  
  // No permitir espacios o caracteres especiales
  if (/[^0-9]/.test(valorTrim)) {
    return "El teléfono no puede contener espacios ni caracteres especiales";
  }

  if (!/^\d+$/.test(valorTrim)) {
    return "El teléfono solo puede contener números";
  }

  if (valorTrim.length !== 8) {
    return "El teléfono debe tener 8 dígitos";
  }

  const num = Number(valorTrim);
  if (num < 60000000 || num > 79999999) {
    return "El teléfono debe ser un número boliviano válido (comenzar con 6 o 7)";
  }

  return null;
};

// ===================== VALIDACIÓN DE CI =====================
export const validarCIEvento = (ci: string): string | null => {
  const valorTrim = ci.trim();

  // No puede estar vacío
  if (valorTrim === "") {
    return "El CI es obligatorio";
  }

  // No permitir espacios
  if (/\s/.test(ci)) {
    return "El CI no puede contener espacios";
  }

  // No puede empezar con 0
  if (valorTrim.startsWith('0')) {
    return "El carnet no puede comenzar con 0";
  }
  // Solo números
  if (!/^\d+$/.test(valorTrim)) {
    return "El CI solo puede contener números y no caracteres especiales como ser .,´, /, #, etc.";
  }
  
  // Longitud entre 6 y 12 dígitos
  if (valorTrim.length < 6 || valorTrim.length > 9) {
    return "El CI debe tener entre 6 y 9 dígitos";
  }

  return null;
};

// ===================== VALIDACIÓN DE EMAIL =====================
export const validarEmailEvento = (email: string): string | null => {
  const valorTrim = email.trim();
  
 // No vacío
  if (valorTrim === "") {
    return "El email es obligatorio";
  }

  // No acepta espacios en ninguna parte del email
  if (/\s/.test(email)) {
    return "El email no puede contener espacios";
  }

  // Validar que solo tenga un @
  const arrobas = valorTrim.split("@").length - 1;
  if (arrobas !== 1) {
    return "El email debe contener exactamente un @";
  }

  // Longitud máxima 50 caracteres
  if (valorTrim.length > 50) {
    return "El email no puede superar 50 caracteres";
  }

  // Dividir en partes para validaciones específicas
  const partes = valorTrim.split("@");
  const usuario = partes[0];
  const dominioCompleto = partes[1];

  // Validar que el usuario no esté vacío
  if (usuario === "") {
    return "El email debe tener una parte antes del @";
  }

  // Validar que el dominio no esté vacío
  if (!dominioCompleto || dominioCompleto === "") {
    return "El email debe tener un dominio después del @";
  }

  // Validar que el dominio tenga extensión
  if (!dominioCompleto.includes(".") || dominioCompleto.endsWith(".")) {
    return "El email debe tener una extensión válida (.com, .edu, etc.)";
  }

  // ========== VALIDACIONES PARA EL USUARIO ==========

  // Validar formato del usuario: solo letras, números, ., -, _
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(usuario)) {
    return "La parte antes del @ solo puede contener letras, números, ., - y _";
  }

  // Validar que no tenga puntos consecutivos excesivos en el usuario
  if (/\.{2,}/.test(usuario)) {
    return "No se permiten puntos consecutivos antes del @";
  }

  // Validar que no sea un solo carácter antes del @
  if (usuario.length < 2) {
    return "La parte antes del @ debe tener al menos 2 caracteres";
  }

  // Validar que el usuario no sea texto sin sentido (como "Isknikvnk")
  if (usuario.length > 5) {
    const vocalesUsuario = usuario.match(/[aeiouAEIOU]/g) || [];
    const ratioVocalesUsuario = vocalesUsuario.length / usuario.length;
    
    // Si tiene menos del 15% de vocales, es probablemente texto aleatorio
    if (ratioVocalesUsuario < 0.15) {
      return "La parte antes del @ debe contener vocales y ser legible";
    }

    // Validar caracteres repetidos en el usuario
    if (/(.)\1{3,}/.test(usuario)) {
      return "No se permiten caracteres repetidos excesivamente antes del @";
    }
  }

  // ========== VALIDACIONES PARA EL DOMINIO COMPLETO ==========

  // Validar puntos consecutivos en el dominio completo (como "hot......juj")
  if (/\.{2,}/.test(dominioCompleto)) {
    return "No se permiten puntos consecutivos en el dominio";
  }

  // Validar formato del dominio completo
  const dominioPartes = dominioCompleto.split(".");
  const dominio = dominioPartes[0];
  const extension = dominioPartes.slice(1).join(".");

  // Validar que el dominio no esté vacío
  if (dominio === "") {
    return "El dominio del email no puede estar vacío";
  }

  // Validar que haya solo una extensión (evitar "hot......juj.com")
  if (dominioPartes.length > 2) {
    return "El dominio no puede contener múltiples extensiones";
  }

  // Validar formato del dominio: solo letras, números, -, .
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(dominio)) {
    return "El dominio solo puede contener letras, números, - y .";
  }

  // Validar que no tenga puntos o guiones consecutivos en el dominio
  if (/\.{2,}/.test(dominio) || /-{2,}/.test(dominio)) {
    return "No se permiten puntos o guiones consecutivos en el dominio";
  }

  // ========== VALIDACIONES PARA DOMINIOS VÁLIDOS ==========

  // 1. Validar longitud mínima y máxima del dominio
  if (dominio.length < 2) {
    return "El dominio debe tener al menos 2 caracteres";
  }
  if (dominio.length > 30) {
    return "El dominio es demasiado largo";
  }

  // 2. Validar que no sean caracteres repetidos consecutivos (más de 3)
  if (/(.)\1{3,}/.test(dominio)) {
    return "El dominio contiene caracteres repetidos excesivamente";
  }

  // 3. Validar números repetidos consecutivos (como 2000000000, 5615555555)
  if (/\d{5,}/.test(dominio)) {
    return "El dominio no puede contener tantos números consecutivos";
  }

  // 4. Validar ratio de vocales/consonantes para detectar texto sin sentido
  const soloLetrasDominio = dominio.replace(/[^a-zA-Z]/g, '');
  if (soloLetrasDominio.length >= 4) {
    const vocales = soloLetrasDominio.match(/[aeiouAEIOU]/g) || [];
    const ratioVocales = vocales.length / soloLetrasDominio.length;
    
    // Si tiene menos del 20% de vocales, probablemente es texto aleatorio
    if (ratioVocales < 0.2) {
      return "El dominio debe contener vocales y ser legible";
    }
  }

  // 5. Validar que tenga al menos 2 caracteres diferentes para dominios
  const caracteresUnicos = new Set(dominio.toLowerCase());
  if (caracteresUnicos.size < 2 && dominio.length > 3) {
    return "El dominio debe contener al menos 2 caracteres diferentes";
  }

  // 6. Validar ratio de unicidad (evitar "aaaaa", "lllll", etc.)
  const ratioUnicidad = caracteresUnicos.size / dominio.length;
  if (dominio.length > 4 && ratioUnicidad < 0.5) {
    return "El dominio es demasiado repetitivo";
  }

  // 7. Validar que no sean solo consonantes consecutivas sin vocales
  if (/^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}$/.test(dominio)) {
    return "El dominio debe contener vocales";
  }

  // 8. Validar extensión del dominio
  if (!/^[a-zA-Z]{2,}$/.test(extension)) {
    return "La extensión del email debe contener solo letras (ej: .com, .org)";
  }

  // 9. Validar longitud de la extensión
  if (extension.length < 2 || extension.length > 6) {
    return "La extensión debe tener entre 2 y 6 caracteres";
  }

  return null;
};

// ===================== VALIDACIÓN DE FECHA DE EVENTO =====================
export const validarFechaEvento = (fecha: string): string | null => {
  if (!fecha || fecha.trim() === "") {
    return "La fecha del evento es obligatoria";
  }

  const fechaSeleccionada = new Date(fecha);
  const hoy = new Date();
  const unAñoDespues = new Date();
  
  // Resetear horas para comparación exacta de días
  hoy.setHours(0, 0, 0, 0);
  unAñoDespues.setHours(0, 0, 0, 0);
  unAñoDespues.setFullYear(unAñoDespues.getFullYear() + 1);

  // No puede ser una fecha pasada o actual
  if (fechaSeleccionada <= hoy) {
    return "La fecha debe ser posterior a hoy";
  }

  // No puede ser más de 1 año en el futuro
  if (fechaSeleccionada > unAñoDespues) {
    return "La fecha no puede ser mayor a 1 año desde hoy";
  }

  return null;
};

// ===================== VALIDACIÓN DE HORA DE INICIO =====================
export const validarHoraInicio = (hora: string): string | null => {
  if (!hora || hora.trim() === "") {
    return "La hora de inicio es obligatoria";
  }

  const [horas, minutos] = hora.split(':').map(Number);
  const horaEnMinutos = horas * 60 + minutos;

  // Mínimo 9:00 AM (540 minutos)
  const minimo = 9 * 60; // 9:00 AM
  // Máximo 20:00 (8:00 PM) (1200 minutos)
  const maximo = 20 * 60; // 8:00 PM

  if (horaEnMinutos < minimo) {
    return "La hora de inicio debe ser desde las 9:00 AM";
  }

  if (horaEnMinutos > maximo) {
    return "La hora de inicio debe ser hasta las 20:00 PM";
  }

  return null;
};

// ===================== VALIDACIÓN DE HORA DE FIN =====================
export const validarHoraFin = (horaInicio: string, horaFin: string, fechaEvento: string): string | null => {
  if (!horaFin || horaFin.trim() === "") {
    return "La hora de fin es obligatoria";
  }

  if (!horaInicio || horaInicio.trim() === "") {
    return "Primero debe seleccionar la hora de inicio";
  }

  // Validar formato de hora (HH:MM)
  const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!horaRegex.test(horaFin)) {
    return "Formato de hora inválido (use HH:MM entre 00:00 y 23:59)";
  }

  const [horasFin, minutosFin] = horaFin.split(':').map(Number);
  const [horasInicio, minutosInicio] = horaInicio.split(':').map(Number);

  // ✅ CORRECCIÓN PRINCIPAL: No permitir horas después de 23:59
  if (horasFin > 23 || minutosFin > 59) {
    return "La hora de fin no puede ser mayor a 23:59";
  }

  const inicioEnMinutos = horasInicio * 60 + minutosInicio;
  const finEnMinutos = horasFin * 60 + minutosFin;

  // ✅ CORRECCIÓN: Validar que la hora fin sea MAYOR que la hora inicio (mismo día)
  if (finEnMinutos <= inicioEnMinutos) {
    return "La hora de fin debe ser posterior a la hora de inicio y su maximo es 23:59 del mismo día";
  }

  // ✅ Validar diferencia mínima de 1 hora
  const diferencia = finEnMinutos - inicioEnMinutos;
  if (diferencia < 60) {
    return "El evento debe tener una duración mínima de 1 hora";
  }

  // ✅ OPCIONAL: Validar hora máxima para fin (ej: 23:59)
  const maximo = 23 * 60 + 59; // 23:59
  if (finEnMinutos > maximo) {
    return "La hora de fin no puede ser mayor a 23:59";
  }

  return null;
};

// ===================== VALIDACIÓN DE CANTIDAD DE PERSONAS =====================
export const validarCantidadPersonasEvento = (cantidad: string): string | null => {
  const valorTrim = cantidad.trim();

  // No puede estar vacío
  if (valorTrim === "") {
    return "La cantidad de personas es obligatoria";
  }

  // No permitir espacios
  if (/\s/.test(cantidad)) {
    return "No puede contener espacios";
  }

  // Solo números
  if (!/^\d+$/.test(valorTrim)) {
    return "Solo puede contener números";
  }

  // No permitir cero a la izquierda (ej: 012, 001, etc.)
  if (valorTrim.length > 1 && valorTrim.startsWith('0')) {
    return "No se permiten ceros a la izquierda";
  }

  const num = Number(valorTrim);

  // Debe ser un número entero
  if (!Number.isInteger(num)) {
    return "Debe ser un número entero";
  }

  // Mínimo 1 persona
  if (num < 1) {
    return "Debe ser al menos 1 persona";
  }

  // Máximo razonable
  if (num > 250) {
    return "El máximo permitido es 250 personas";
  }

  return null;
};
// ===================== VALIDAR TODO EL FORMULARIO =====================
export const validarFormularioEvento = (formData: {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  carnet: string;
  fechaEvento: string;
  cantidadPersonas: string;
  tipoReserva: string;
  horaInicio: string;
  horaFin: string;
}): Record<string, string | null> => {
  const erroresApellidos = validarApellidosEvento(formData.apellidoPaterno, formData.apellidoMaterno);

  return {
    nombre: validarNombreEvento(formData.nombre),
    apellidoPaterno: erroresApellidos.paterno,
    apellidoMaterno: erroresApellidos.materno,
    telefono: validarTelefonoEvento(formData.telefono),
    email: validarEmailEvento(formData.email),
    carnet: validarCIEvento(formData.carnet),
    fechaEvento: validarFechaEvento(formData.fechaEvento),
    cantidadPersonas: validarCantidadPersonasEvento(formData.cantidadPersonas),
    tipoReserva: formData.tipoReserva ? null : "Debe seleccionar un tipo de evento",
    horaInicio: validarHoraInicio(formData.horaInicio),
    horaFin: validarHoraFin(formData.horaInicio, formData.horaFin, formData.fechaEvento),
  };
};

// ===================== UTILIDADES PARA INPUTS =====================

// Permitir solo números y bloquear letras (reutilizable)
export const soloNumerosEvento = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const tecla = e.key;
  if (
    !/[0-9]/.test(tecla) &&
    !['Backspace', 'Delete', 'Tab', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(tecla) &&
    !(e.ctrlKey && ['a', 'c', 'v', 'x'].includes(tecla.toLowerCase()))
  ) {
    e.preventDefault();
  }
};

// Permitir solo letras y espacios (reutilizable)
export const soloLetrasEvento = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const tecla = e.key;
  const esLetra = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(tecla);
  const esTeclaEspecial = ['Backspace', 'Delete', 'Tab', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(tecla);
  const esControl = e.ctrlKey && ['a', 'c', 'v', 'x'].includes(tecla.toLowerCase());

  if (!esLetra && !esTeclaEspecial && !esControl) {
    e.preventDefault();
  }
};

// Bloquear caracteres especiales en números
export const bloquearCaracteresEspecialesEvento = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
    e.preventDefault();
  }
};



// ===================== VALIDACIÓN DE COMPROBANTE =====================
export const validarComprobante = (archivo: File): string | null => {
  if (!archivo) {
    return "El comprobante de pago es obligatorio";
  }

  // Validar tipo MIME
  const tiposPermitidos = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf'
  ];

  // Validar extensión del archivo
  const extension = archivo.name.toLowerCase().split('.').pop() || '';
  const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'pdf'];

  // Validar tipo MIME y extensión
  if (!tiposPermitidos.includes(archivo.type) || !extensionesPermitidas.includes(extension)) {
    return "Solo se permiten archivos JPG, PNG o PDF";
  }

  // Validar tamaño (5MB máximo)
  const tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
  if (archivo.size > tamañoMaximo) {
    return "El archivo no puede ser mayor a 5MB";
  }

  // Validar que el archivo no esté vacío
  if (archivo.size === 0) {
    return "El archivo está vacío";
  }

  return null;
};