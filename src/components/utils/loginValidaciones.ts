// loginValidations.ts

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export interface LoginFormErrors {
  usuario: string;
  password: string;
}

/**
 * Verifica si un texto tiene caracteres repetidos consecutivamente (más de 2 veces)
 */
const hasExcessiveRepeatedChars = (text: string): boolean => {
  // Expresión regular que detecta 3 o más caracteres iguales consecutivos
  const repeatedPattern = /(.)\1{2,}/;
  return repeatedPattern.test(text);
};

/**
 * Verifica si un texto tiene espacios excesivos entre caracteres
 * Ejemplo: "A n a" o "m a r i a"
 */
const hasExcessiveSpacing = (text: string): boolean => {
  // Detecta si hay más de un espacio entre caracteres individuales
  // o si hay espacios entre cada letra
  const spacingPattern = /^[a-zA-Z](\s+[a-zA-Z])+$/;
  const multipleSpaces = /\s{2,}/;
  
  return spacingPattern.test(text) || multipleSpaces.test(text);
};

/**
 * Verifica si el username tiene un formato válido
 * Permite: letras y puntos únicamente
 */
const isValidUsernameFormat = (username: string): boolean => {
  // Permite solo letras (mayúsculas y minúsculas) y puntos
  // No permite números, espacios, guiones ni otros caracteres especiales
  const validFormat = /^[a-zA-Z.]+$/;
  return validFormat.test(username);
};

/**
 * Valida que el campo usuario cumpla con todos los requisitos
 */
export const validateUsuario = (usuario: string): ValidationResult => {
  // Campo vacío
  if (!usuario.trim()) {
    return {
      isValid: false,
      error: "El nombre de usuario es obligatorio"
    };
  }

  // Solo espacios
  if (usuario.trim().length === 0) {
    return {
      isValid: false,
      error: "El nombre de usuario no puede contener solo espacios"
    };
  }

  // Espacios excesivos entre caracteres
  if (hasExcessiveSpacing(usuario)) {
    return {
      isValid: false,
      error: "El nombre de usuario no puede tener espacios entre caracteres"
    };
  }

  // Longitud mínima de 3 caracteres
  if (usuario.trim().length < 3) {
    return {
      isValid: false,
      error: "El nombre de usuario debe tener al menos 3 caracteres"
    };
  }

  // Longitud máxima de 150 caracteres
  if (usuario.length > 150) {
    return {
      isValid: false,
      error: "El nombre de usuario no puede exceder los 150 caracteres"
    };
  }

  // Formato válido (solo letras y puntos)
  if (!isValidUsernameFormat(usuario)) {
    return {
      isValid: false,
      error: "El nombre de usuario solo puede contener letras y puntos"
    };
  }

  // Caracteres repetidos excesivamente
  if (hasExcessiveRepeatedChars(usuario)) {
    return {
      isValid: false,
      error: "El nombre de usuario no puede tener caracteres repetidos consecutivamente"
    };
  }

  return {
    isValid: true,
    error: ""
  };
};

/**
 * Valida que el campo password cumpla con los requisitos
 */
export const validatePassword = (password: string): ValidationResult => {
  // Campo vacío
  if (!password) {
    return {
      isValid: false,
      error: "La contraseña es obligatoria"
    };
  }

  // Solo espacios
  if (password.trim().length === 0) {
    return {
      isValid: false,
      error: "La contraseña no puede estar vacía ni contener solo espacios"
    };
  }

  // Longitud mínima de 8 caracteres
  if (password.length < 8) {
    return {
      isValid: false,
      error: "La contraseña debe tener al menos 8 caracteres"
    };
  }

  return {
    isValid: true,
    error: ""
  };
};

/**
 * Valida todo el formulario de login
 */
export const validateLoginForm = (usuario: string, password: string): {
  isValid: boolean;
  errors: LoginFormErrors;
} => {
  const usuarioValidation = validateUsuario(usuario);
  const passwordValidation = validatePassword(password);

  return {
    isValid: usuarioValidation.isValid && passwordValidation.isValid,
    errors: {
      usuario: usuarioValidation.error,
      password: passwordValidation.error
    }
  };
};

/**
 * Valida ambos campos para verificar si están vacíos
 */
export const validateBothFieldsNotEmpty = (usuario: string, password: string): ValidationResult => {
  if (!usuario.trim() && !password.trim()) {
    return {
      isValid: false,
      error: "Debe ingresar su usuario y contraseña"
    };
  }

  return {
    isValid: true,
    error: ""
  };
};