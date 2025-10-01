import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useAuth } from "../../hooks/auth/useAuth";
import Button from "../ui/button/Button";
import { X, Waves } from "lucide-react";

export default function PoolLoginPage() {
  const [loginForm, setLoginForm] = useState({
    usuario: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ username: loginForm.usuario, password: loginForm.password });
      setLoginForm({ usuario: "", password: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-blue-100 p-4">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200 relative">
        {/* Logo estilo modal */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-teal-700 mb-1">Iniciar Sesión</h3>
          <p className="text-gray-600">Accede a tu cuenta del sistema de reservas</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Usuario</label>
            <input
              type="text"
              value={loginForm.usuario}
              onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Tu usuario"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* Botón Ingresar */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition shadow-md"
          >
            Ingresar
          </Button>
        </form>

        {/* Pie con ayuda */}
        <div className="mt-6 text-center">
          <button className="text-cyan-600 hover:text-teal-700 transition font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{" "}
            <button className="text-teal-600 hover:text-cyan-700 transition font-medium">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
