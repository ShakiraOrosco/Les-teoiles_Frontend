import { X, Waves } from 'lucide-react';
import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { usuario: string; password: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginForm, setLoginForm] = useState({
    usuario: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginForm);
    setLoginForm({ usuario: '', password: '' });
  };

  const handleClose = () => {
    setLoginForm({ usuario: '', password: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-teal-700">Iniciar Sesión</h3>
          <p className="text-gray-600">Accede a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Usuario</label>
            <input 
              type="text" 
              value={loginForm.usuario}
              onChange={(e) => setLoginForm({...loginForm, usuario: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Tu usuario"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Tu contraseña"
              required
            />
          </div>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            type="button"
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition shadow-md"
            >
            Ingresar
        </button>

        </form>

        <div className="mt-6 text-center">
          <button className="text-cyan-600 hover:text-teal-700 transition font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <button  className="text-teal-600 hover:text-cyan-700 transition font-medium">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}