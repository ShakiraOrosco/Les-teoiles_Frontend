import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = '' }: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCurrentPage = (page: string) => currentPage === page;

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y Título */}
          <div className="flex items-center space-x-3">
            <div className="w-21 h-20 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/images/Informativa/LogoPlayaAzul.png" 
                alt="Logo Piscina Playa Azul" 
                className="w-19 h-17 object-cover" 
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-teal-900">Piscina Playa Azul</h1>
              <p className="text-xs md:text-sm text-gray-500">Tu destino de relax</p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a
              href="/home"
              className={`transition ${
                isCurrentPage('home') ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-teal-700'
              }`}
            >
              Inicio
            </a>
            <a
              href="/sobre-nosotros"
              className={`transition ${
                isCurrentPage('sobre-nosotros') ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-teal-700'
              }`}
            >
              Sobre Nosotros
            </a>
            <a
              href="/reservas"
              className={`transition ${
                isCurrentPage('reservas') ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-teal-700'
              }`}
            >
              Reservas
            </a>
            <a
              href="/contactanos"
              className={`transition ${
                isCurrentPage('contactanos') ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-teal-700'
              }`}
            >
              Contáctanos
            </a>
            <button
              onClick={() => navigate('/signin')}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-semibold"
            >
              Iniciar Sesión
            </button>
          </nav>

          {/* Botón Menú Hamburguesa (Mobile) */}
          <button
            className="md:hidden text-teal-700 hover:text-teal-900 transition p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Menú Mobile Desplegable */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white animate-slideDown">
            <nav className="flex flex-col space-y-3">
              <a
                href="/home"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition flex items-center ${
                  isCurrentPage('home')
                    ? 'bg-teal-100 text-teal-700 font-semibold'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                <span className="mr-3 text-xl">🏠</span>
                <span>Inicio</span>
              </a>
              
              <a
                href="/sobre-nosotros"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition flex items-center ${
                  isCurrentPage('sobre-nosotros')
                    ? 'bg-teal-100 text-teal-700 font-semibold'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                <span className="mr-3 text-xl">ℹ️</span>
                <span>Sobre Nosotros</span>
              </a>
              
              <a
                href="/contactanos"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition flex items-center ${
                  isCurrentPage('contactanos')
                    ? 'bg-teal-100 text-teal-700 font-semibold'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                <span className="mr-3 text-xl">📞</span>
                <span>Contáctanos</span>
              </a>
              
              <div className="px-4 pt-2">
                <button
                  onClick={() => handleNavigation('/signin')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-semibold flex items-center justify-center"
                >
                  <span className="mr-2 text-xl">🔐</span>
                  <span>Iniciar Sesión</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Estilos para la animación */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}