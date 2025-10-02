import { MapPin, Phone, Mail } from 'lucide-react';
//import { HashLink } from 'react-router-hash-link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-19 h-18 bg-gradient-to-br from-white-400 to-teal-600 rounded-full flex items-center justify-center">
                <img src="/images/Informativa/LogoPlayaAzul.png" alt="Logo" className="w-18 h-16" />
              </div>
              <h4 className="text-xl font-bold">Piscina Playa Azul</h4>
            </div>
            <p className="text-gray-400">
              Tu destino ideal para descanso, diversión y eventos especiales.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h5 className="font-bold mb-4">Enlaces Rápidos</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/home" className="hover:text-cyan-400 transition">Inicio</a></li>
              <li><a href="/sobre-nosotros" className="hover:text-cyan-400 transition">Sobre Nosotros</a></li>
              {/*<li>
                <HashLink
                  smooth
                  to="/home#servicios"
                  scroll={(el) => {
                    const yOffset = -100; // igual que en el Header
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition"
                >
                  Servicios
                </HashLink>
              </li>*/}
              <li><a href="/contactanos" className="hover:text-cyan-400 transition">Contáctanos</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5 className="font-bold mb-4">Contacto</h5>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                Ciudad Reyes, Beni <br />
                Calle Comercio esquina Calle Libertad N°500
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-cyan-400" />
                (+591) 73031166
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                edgaroroscolinares@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copy */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Piscina Playa Azul. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
