import { MapPin, Phone, Mail, Waves } from 'lucide-react';

export default function Footer() {
  return (
     <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold">Piscina Playa Azul</h4>
              </div>
              <p className="text-gray-400">Tu destino ideal para descanso, diversión y eventos especiales.</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Enlaces Rápidos</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#inicio" className="hover:text-cyan-400 transition">Inicio</a></li>
                <li><a href="/sobre-nosotros" className="hover:text-cyan-400 transition">Sobre Nosotros</a></li>
                <li><a href="#servicios" className="hover:text-cyan-400 transition">Servicios</a></li>
                <li><a href="/contactanos" className="hover:text-cyan-400 transition">Contáctanos</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contacto</h5>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                  La Paz, Bolivia
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-cyan-400" />
                  +591 123 45678
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                  info@piscinaplayaazul.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Piscina Playa Azul. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  );
}