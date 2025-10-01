import { Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
interface HeaderProps {
  currentPage?: string;
}
 
export default function Header({ currentPage = '' }: HeaderProps) {
  const navigate = useNavigate();
 
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
 
  const isCurrentPage = (page: string) => currentPage === page;
 
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full flex items-center justify-center">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-700">Piscina Playa Azul</h1>
              <p className="text-xs text-gray-500">Tu destino de relax</p>
            </div>
          </div>
         
          <nav className="hidden md:flex space-x-8">
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
              href="/home#servicios"
              className="text-gray-600 hover:text-teal-700 transition"
            >
              Servicios
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
        </div>
      </div>
    </header>
  );
}
 
 