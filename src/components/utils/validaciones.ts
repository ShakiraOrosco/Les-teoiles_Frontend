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
  // Máximo 35 caracteres
  if (valorTrim.length > 35) {
    return "El nombre no puede superar 35 caracteres";
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
    // ✨ Validar espacios al inicio o final
    if (apellidoPaterno !== paternoTrim) {
      errores.paterno = "No puede tener espacios al inicio o al final";
    }
    // ✨ No permitir espacios múltiples consecutivos
    else if (/\s{2,}/.test(paternoTrim)) {
      errores.paterno = "No puede tener espacios consecutivos";
    }
    // ✨ No permitir letras separadas por espacios (como "G o n z a l e s")
    else if (paternoTrim.split(/\s+/).some((p, idx) => p.length === 1 && idx > 0)) {
      errores.paterno = "No puede tener letras separadas por espacios";
    }
    // ✨ No permitir letras sueltas (como "Gonzale s")
    else if (/\b\w+\s+\w\b/.test(paternoTrim)) {
      errores.paterno = "No puede tener letras sueltas";
    }
    else if (paternoTrim.length < 3) {
      errores.paterno = "Apellido paterno debe tener al menos 3 caracteres";
    } else if (paternoTrim.length > 25) {
      errores.paterno = "Apellido paterno no puede superar 25 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(paternoTrim)) {
      errores.paterno = "Solo puede contener letras y espacios";
    } else if (/(.)\1{2,}/.test(paternoTrim)) {
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
    // ✨ Validar espacios al inicio o final
    if (apellidoMaterno !== maternoTrim) {
      errores.materno = "No puede tener espacios al inicio o al final";
    }
    // ✨ No permitir espacios múltiples consecutivos
    else if (/\s{2,}/.test(maternoTrim)) {
      errores.materno = "No puede tener espacios consecutivos";
    }
    // ✨ No permitir letras separadas por espacios
    else if (maternoTrim.split(/\s+/).some((p, idx) => p.length === 1 && idx > 0)) {
      errores.materno = "No puede tener letras separadas por espacios";
    }
    // ✨ No permitir letras sueltas
    else if (/\b\w+\s+\w\b/.test(maternoTrim)) {
      errores.materno = "No puede tener letras sueltas";
    }
    else if (maternoTrim.length < 3) {
      errores.materno = "Apellido materno debe tener al menos 3 caracteres";
    } else if (maternoTrim.length > 25) {
      errores.materno = "Apellido materno no puede superar 25 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(maternoTrim)) {
      errores.materno = "Solo puede contener letras y espacios";
    } else if (/(.)\1{2,}/.test(maternoTrim)) {
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
  
  // 1. Verificar si está vacío
  if (valorTrim === "") {
    return "El email es obligatorio";
  }
  
  // 2. Verificar espacios
  if (/\s/.test(email)) {
    return "El email no puede contener espacios";
  }
  
  // 3. Verificar longitud
  if (valorTrim.length > 50) {
    return "El email no puede superar 50 caracteres";
  }
  
  // 4. Verificar que contenga @ (ANTES de la regex)
  if (!valorTrim.includes("@")) {
    return "El email debe contener @";
  }
  
  // 5. Verificar estructura básica
  const partes = valorTrim.split("@");
  
  if (partes.length !== 2) {
    return "El email solo puede contener un @";
  }
  
  if (!partes[0] || partes[0].trim() === "") {
    return "El email debe tener un nombre antes del @";
  }
  
  if (!partes[1] || partes[1].trim() === "") {
    return "El email debe tener un dominio después del @";
  }
  
  if (!partes[1].includes(".")) {
    return "El dominio debe contener un punto (.)";
  }
  
  if (partes[1].endsWith(".")) {
    return "El dominio no puede terminar con punto";
  }
  
  const extension = partes[1].split(".").pop();
  if (!extension || extension.length < 2) {
    return "El email debe tener una extensión válida (.com, .edu, etc.)";
  }
  
  // 6. Validación final con regex
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(valorTrim)) {
    return "El formato del email no es válido";
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
    return "El carnet solo puede contener números";
  }
  
  if (valorTrim.length < 6 || valorTrim.length > 9) {
    return "El carnet debe tener entre 6 y 9 dígitos";
  }
  
  if (/^(.)\1+$/.test(valorTrim)) {
    return "El carnet no puede contener solo dígitos repetidos";
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
    const fin = new Date(fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (inicio < hoy) errores.inicio = "No puedes seleccionar una fecha pasada";
    if (fin <= inicio) errores.fin = "La fecha de fin debe ser después de la fecha de inicio";
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
