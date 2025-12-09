import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import Button from "../ui/button/Button";
import { Waves, Lock, AlertCircle } from "lucide-react";
import { 
  validateUsuario, 
  validatePassword, 
  validateLoginForm,
  validateBothFieldsNotEmpty,
  type LoginFormErrors 
} from "../../components/utils/loginValidaciones";

// Iconos SVG inline
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeCloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const STORAGE_KEY = "login_block_data";

interface BlockData {
  intentos: number;
  bloqueadoHasta: number | null;
}

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
  
  // Estados para el bloqueo
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const { loginUser } = useAuth();

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data: BlockData = JSON.parse(savedData);
        const ahora = Date.now();
        
        // Si hay un bloqueo activo
        if (data.bloqueadoHasta && data.bloqueadoHasta > ahora) {
          setBloqueado(true);
          setIntentosFallidos(data.intentos);
          const segundosRestantes = Math.ceil((data.bloqueadoHasta - ahora) / 1000);
          setTiempoRestante(segundosRestantes);
          setGeneralError("Demasiados intentos fallidos. Cuenta bloqueada por 1 minuto.");
        } else if (data.bloqueadoHasta && data.bloqueadoHasta <= ahora) {
          // El bloqueo ya expiró, limpiar
          localStorage.removeItem(STORAGE_KEY);
          setIntentosFallidos(0);
        } else {
          // Hay intentos pero no está bloqueado
          setIntentosFallidos(data.intentos);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de bloqueo:", error);
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    try {
      if (bloqueado && tiempoRestante > 0) {
        const data: BlockData = {
          intentos: intentosFallidos,
          bloqueadoHasta: Date.now() + (tiempoRestante * 1000)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else if (intentosFallidos > 0 && !bloqueado) {
        const data: BlockData = {
          intentos: intentosFallidos,
          bloqueadoHasta: null
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else if (intentosFallidos === 0) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error al guardar datos de bloqueo:", error);
    }
  }, [bloqueado, intentosFallidos, tiempoRestante]);

  // Efecto para el countdown del bloqueo
  useEffect(() => {
    if (bloqueado && tiempoRestante > 0) {
      const timer = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            // Desbloquear cuando llega a 0
            setBloqueado(false);
            setIntentosFallidos(0);
            setGeneralError("");
            localStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [bloqueado, tiempoRestante]);

  // Función para formatear el tiempo restante
  const formatTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bloqueado) return;
    
    const value = e.target.value;
    setLoginForm({ ...loginForm, usuario: value });
    setGeneralError("");

    if (touched.usuario) {
      const validation = validateUsuario(value);
      setErrors({ ...errors, usuario: validation.error });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bloqueado) return;
    
    const value = e.target.value;
    setLoginForm({ ...loginForm, password: value });
    setGeneralError("");

    if (touched.password) {
      const validation = validatePassword(value);
      setErrors({ ...errors, password: validation.error });
    }
  };

  const handleUsuarioBlur = () => {
    if (bloqueado) return;
    
    setTouched({ ...touched, usuario: true });
    const validation = validateUsuario(loginForm.usuario);
    setErrors({ ...errors, usuario: validation.error });
  };

  const handlePasswordBlur = () => {
    if (bloqueado) return;
    
    setTouched({ ...touched, password: true });
    const validation = validatePassword(loginForm.password);
    setErrors({ ...errors, password: validation.error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bloqueado) {
      return;
    }

    setTouched({ usuario: true, password: true });

    const bothFieldsValidation = validateBothFieldsNotEmpty(loginForm.usuario, loginForm.password);
    if (!bothFieldsValidation.isValid) {
      setGeneralError(bothFieldsValidation.error);
      return;
    }

    const validation = validateLoginForm(loginForm.usuario, loginForm.password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Intentar login
    try {
      await loginUser({ username: loginForm.usuario, password: loginForm.password });
      
      // Si llegamos aquí, login exitoso - resetear todo
      setLoginForm({ usuario: "", password: "" });
      setErrors({ usuario: "", password: "" });
      setTouched({ usuario: false, password: false });
      setGeneralError("");
      setIntentosFallidos(0);
      localStorage.removeItem(STORAGE_KEY);
      
    } catch (err) {
      // Login falló - incrementar contador
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      
      if (nuevosIntentos >= 3) {
        setBloqueado(true);
        setTiempoRestante(60);
        setGeneralError("Demasiados intentos fallidos. Cuenta bloqueada por 1 minuto.");
      } 
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="text-center pt-8 pb-6 px-8" id="Seccion-Iniciar-Sesion">
        <div className={`w-16 h-16 ${bloqueado ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-cyan-500 to-teal-600'} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300`}>
          {bloqueado ? (
            <Lock className="w-8 h-8 text-white" />
          ) : (
            <Waves className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-teal-800 dark:text-cyan-400 mb-2" id="Titulo-Iniciar-Sesion">
          {bloqueado ? 'Cuenta Bloqueada' : 'Iniciar Sesión'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400" id="Descripcion-Iniciar-Sesion">
          {bloqueado ? `Espera ${formatTiempo(tiempoRestante)} para intentar nuevamente` : 'Accede a tu cuenta del sistema de reservas'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-5">
        {/* Banner de advertencia de intentos */}
        {intentosFallidos > 0 && !bloqueado && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                Advertencia: Intento {intentosFallidos} de 3
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                {3 - intentosFallidos} intento(s) restante(s) antes del bloqueo
              </p>
            </div>
          </div>
        )}

        {/* Error general o mensaje de bloqueo */}
        {generalError && (
          <div className={`p-3 ${bloqueado ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} border rounded-lg`}>
            <p className={`text-sm ${bloqueado ? 'text-red-700 dark:text-red-300 font-semibold' : 'text-red-600 dark:text-red-400'} text-center`} id="Error-General">
              {generalError}
            </p>
          </div>
        )}

        <div id="Contenedor-Usuario">
          <label className={`block text-sm font-semibold ${bloqueado ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'} mb-2`} id="Etiqueta-Usuario">
            Usuario
          </label>
          <input
            id="input-usuario"
            type="text"
            value={loginForm.usuario}
            onChange={handleUsuarioChange}
            onBlur={handleUsuarioBlur}
            disabled={bloqueado}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
              bloqueado 
                ? "border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50"
                : errors.usuario && touched.usuario
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
            } rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder={bloqueado ? "Bloqueado temporalmente" : "Tu usuario"}
          />
          {errors.usuario && touched.usuario && !bloqueado && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="Error-Usuario">{errors.usuario}</p>
          )}
        </div>

        <div id="Contenedor-Contraseña">
          <label className={`block text-sm font-semibold ${bloqueado ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'} mb-2`} id="Etiqueta-Contraseña">
            Contraseña
          </label>
          <div className="relative" id="Seccion-Contraseña">
            <input
              id="input-password"
              type={showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              maxLength={50}
              disabled={bloqueado}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                bloqueado
                  ? "border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50"
                  : errors.password && touched.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              } rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 pr-12`}
              placeholder={bloqueado ? "Bloqueado temporalmente" : "Tu contraseña"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={bloqueado}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${bloqueado ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'} transition p-1`}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeCloseIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && touched.password && !bloqueado && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="Error-Contraseña">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          id="Boton-Ingresar"
          name="Boton-Ingresar"
          disabled={bloqueado}
          className={`w-full ${
            bloqueado
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700'
          } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:transform-none disabled:shadow-md`}
        >
          {bloqueado ? `Bloqueado (${formatTiempo(tiempoRestante)})` : 'Ingresar'}
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

      <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Piscina Playa Azul &copy; {new Date().getFullYear()}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}