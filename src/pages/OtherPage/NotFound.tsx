import { Link } from 'react-router';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Botón de tema */}
      <div className="fixed z-50 top-6 right-6">
        <ThemeTogglerTwo />
      </div>

      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img 
            src="/images/Informativa/LogoPlayaAzul.png" 
            alt="Piscina Playa Azul Logo" 
            className="w-50 h-50 object-contain drop-shadow-lg"
          />
        </div>

        {/* Nombre de la empresa con olitas */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <svg className="w-16 h-12" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40C20 20 40 20 60 40C80 60 100 60 120 40C140 20 160 20 180 40C190 50 195 55 200 60V80H0V40Z" fill="url(#gradient1)" opacity="0.3"/>
            <path d="M0 50C20 30 40 30 60 50C80 70 100 70 120 50C140 30 160 30 180 50C190 60 195 65 200 70V80H0V50Z" fill="url(#gradient2)" opacity="0.5"/>
            <path d="M0 60C20 40 40 40 60 60C80 80 100 80 120 60C140 40 160 40 180 60C190 70 195 75 200 80H0V60Z" fill="url(#gradient3)"/>
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="200" y2="0">
                <stop offset="0%" stopColor="#06b6d4"/>
                <stop offset="100%" stopColor="#0891b2"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="0" y1="0" x2="200" y2="0">
                <stop offset="0%" stopColor="#0891b2"/>
                <stop offset="100%" stopColor="#0e7490"/>
              </linearGradient>
              <linearGradient id="gradient3" x1="0" y1="0" x2="200" y2="0">
                <stop offset="0%" stopColor="#0e7490"/>
                <stop offset="100%" stopColor="#155e75"/>
              </linearGradient>
            </defs>
          </svg>
          
          <h2 className="text-3xl font-bold text-teal-800 dark:text-cyan-400 transition-colors duration-300">
            Piscina Playa Azul
          </h2>

          <svg className="w-16 h-12" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40C20 20 40 20 60 40C80 60 100 60 120 40C140 20 160 20 180 40C190 50 195 55 200 60V80H0V40Z" fill="url(#gradient4)" opacity="0.3"/>
            <path d="M0 50C20 30 40 30 60 50C80 70 100 70 120 50C140 30 160 30 180 50C190 60 195 65 200 70V80H0V50Z" fill="url(#gradient5)" opacity="0.5"/>
            <path d="M0 60C20 40 40 40 60 60C80 80 100 80 120 60C140 40 160 40 180 60C190 70 195 75 200 80H0V60Z" fill="url(#gradient6)"/>
            <defs>
              <linearGradient id="gradient4" x1="0" y1="0" x2="200" y2="0">
                <stop offset="0%" stopColor="#06b6d4"/>
                <stop offset="100%" stopColor="#0891b2"/>
              </linearGradient>
              <linearGradient id="gradient5" x1="0" y1="0" x2="200" y2="0">
                <stop offset="0%" stopColor="#0891b2"/>
                <stop offset="100%" stopColor="#0e7490"/>
              </linearGradient>
              <linearGradient id="gradient6" x1="0" y1="0" x2="200" y2="0">
                <stop offset="0%" stopColor="#0e7490"/>
                <stop offset="100%" stopColor="#155e75"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Error 404 */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-600 mb-8">
          404
        </h1>

        {/* Mensaje */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-5 max-w-md mx-auto transition-colors duration-300">
          Lo sentimos, parece que esta página se ha ido a nadar a aguas desconocidas. 
          No podemos encontrar lo que buscas.
        </p>

        {/* Botón */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al inicio
        </Link>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Piscina Playa Azul. Todos los derechos reservados.
      </p>
    </div>
  );
}