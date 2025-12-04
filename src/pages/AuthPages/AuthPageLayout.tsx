import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 h-screen overflow-hidden">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center w-full h-full lg:grid lg:grid-cols-2 z-6">
        {/* Panel lateral izquierdo - Branding */}
        <div className="items-center justify-center hidden lg:flex p-12 h-full">
          <div className="flex flex-col items-center justify-center max-w-lg">
            {/* Logo y Título */}
            <div className="flex items-center gap-6 mb-2">
              <img
                src="/images/Informativa/LogoPlayaAzul.png"
                alt="Piscina Playa Azul Logo"
                className="w-50 h-50 object-contain drop-shadow-2xl"
              />
              <div>
                <h1 className="text-3xl font-bold text-teal-800 dark:text-cyan-400 mb-2">
                  Piscina Playa Azul
                </h1>
                <p className="text-lg text-cyan-700 dark:text-cyan-500 font-medium">
                  Tu destino de relax
                </p>
              </div>
            </div>

            {/* Ilustración de olas decorativas */}
            <div className="mb-6">
              <svg className="w-full max-w-md h-40" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 80C40 40 80 40 120 80C160 120 200 120 240 80C280 40 320 40 360 80C380 100 390 110 400 120V160H0V80Z" fill="url(#wave1)" opacity="0.3"/>
                <path d="M0 100C40 60 80 60 120 100C160 140 200 140 240 100C280 60 320 60 360 100C380 120 390 130 400 140V160H0V100Z" fill="url(#wave2)" opacity="0.5"/>
                <path d="M0 120C40 80 80 80 120 120C160 160 200 160 240 120C280 80 320 80 360 120C380 140 390 150 400 160H0V120Z" fill="url(#wave3)"/>
                <defs>
                  <linearGradient id="wave1" x1="0" y1="0" x2="400" y2="0">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#0891b2"/>
                  </linearGradient>
                  <linearGradient id="wave2" x1="0" y1="0" x2="400" y2="0">
                    <stop offset="0%" stopColor="#0891b2"/>
                    <stop offset="100%" stopColor="#0e7490"/>
                  </linearGradient>
                  <linearGradient id="wave3" x1="0" y1="0" x2="400" y2="0">
                    <stop offset="0%" stopColor="#0e7490"/>
                    <stop offset="100%" stopColor="#155e75"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Descripción */}
            <div className="text-center max-w-md">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Un lugar lleno de risas, magia y diversión
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Accede a tu cuenta del sistema de reservas para gestionar las visitas  y reservas de manera fácil y rápida.
              </p>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario de Login */}
        <div className="flex items-center justify-center w-full h-full p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Logo móvil */}
            <div className="flex justify-center mb-6 lg:hidden">
              <img
                src="/images/Informativa/LogoPlayaAzul.png"
                alt="Piscina Playa Azul Logo"
                className="w-24 h-24 object-contain drop-shadow-xl"
              />
            </div>
            
            {/* Formulario */}
            {children}
          </div>
        </div>
      </div>

      {/* Link volver en la esquina inferior izquierda */}
      <div className="absolute bottom-6 left-6 z-50" id="Volver-Inicio-Contenedor">
        <Link 
          to="/" 
          id="Volver-Inicio"
          className="inline-flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium hover:underline transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la página principal
        </Link>
      </div>

      {/* Botón de tema */}
      <div className="absolute bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}