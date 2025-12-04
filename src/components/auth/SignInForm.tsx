import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useAuth } from "../../hooks/auth/useAuth";
import Button from "../ui/button/Button";
import { Waves } from "lucide-react";

import { 
  validateUsuario, 
  validatePassword, 
  validateLoginForm,
  validateBothFieldsNotEmpty,
  type LoginFormErrors 
} from "../../components/utils/loginValidaciones";

export default function PoolLoginPage() {
  const [loginForm, setLoginForm] = useState({
    usuario: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({
    usuario: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    usuario: false,
    password: false
  });
  const [generalError, setGeneralError] = useState("");

  const { loginUser } = useAuth();

  // Validación en tiempo real para el campo usuario
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoginForm({ ...loginForm, usuario: value });
    setGeneralError(""); // Limpiar error general

    // Solo validar si el campo ha sido tocado
    if (touched.usuario) {
      const validation = validateUsuario(value);
      setErrors({ ...errors, usuario: validation.error });
    }
  };

  // Validación en tiempo real para el campo password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoginForm({ ...loginForm, password: value });
    setGeneralError(""); // Limpiar error general

    // Solo validar si el campo ha sido tocado
    if (touched.password) {
      const validation = validatePassword(value);
      setErrors({ ...errors, password: validation.error });
    }
  };

  // Manejar cuando el usuario sale del campo (onBlur)
  const handleUsuarioBlur = () => {
    setTouched({ ...touched, usuario: true });
    const validation = validateUsuario(loginForm.usuario);
    setErrors({ ...errors, usuario: validation.error });
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    const validation = validatePassword(loginForm.password);
    setErrors({ ...errors, password: validation.error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({ usuario: true, password: true });

    // Validar que ambos campos no estén vacíos
    const bothFieldsValidation = validateBothFieldsNotEmpty(loginForm.usuario, loginForm.password);
    if (!bothFieldsValidation.isValid) {
      setGeneralError(bothFieldsValidation.error);
      return;
    }

    // Validar todo el formulario
    const validation = validateLoginForm(loginForm.usuario, loginForm.password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Si pasa todas las validaciones, intentar login
    try {
      await loginUser({ username: loginForm.usuario, password: loginForm.password });
      setLoginForm({ usuario: "", password: "" });
      setErrors({ usuario: "", password: "" });
      setTouched({ usuario: false, password: false });
      setGeneralError("");
    } catch (err) {
      console.error(err);
      // Aquí podrías setear un error general del servidor
      setGeneralError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header con icono */}
      <div className="text-center pt-8 pb-6 px-8" id="Seccion-Iniciar-Sesion">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Waves className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-teal-800 dark:text-cyan-400 mb-2" id="Titulo-Iniciar-Sesion">Iniciar Sesión</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400" id="Descripcion-Iniciar-Sesion">Accede a tu cuenta del sistema de reservas</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-5">
        {/* Error general */}
        {generalError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center" id="Error-General">{generalError}</p>
          </div>
        )}

        {/* Usuario */}
        <div id="Contenedor-Usuario">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" id="Etiqueta-Usuario">Usuario</label>
          <input
            id="input-usuario"
            type="text"
            value={loginForm.usuario}
            onChange={handleUsuarioChange}
            onBlur={handleUsuarioBlur}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
              errors.usuario && touched.usuario
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
            } rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Tu usuario"
          />
          {errors.usuario && touched.usuario && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="Error-Usuario">{errors.usuario}</p>
          )}
        </div>

        {/* Contraseña */}
        <div id="Contenedor-Contraseña">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" id="Etiqueta-Contraseña">Contraseña</label>
          <div className="relative" id="Seccion-Contraseña">
            <input
              id="input-password"
              type={showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              maxLength={50}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                errors.password && touched.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              } rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 pr-12`}
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="Error-Contraseña">{errors.password}</p>
          )}
        </div>

        {/* Botón Ingresar */}
        <Button
          type="submit"
          id="Boton-Ingresar"
          name="Boton-Ingresar"
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          Ingresar
        </Button>

        {/* Olvidaste contraseña 
        <div className="text-center">
          <button 
            type="button"
            className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition font-medium hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
          
        </div>*/}
      </form>

      {/* Footer - Registro */}
      <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
       <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Piscina Playa Azul &copy; {new Date().getFullYear()}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}