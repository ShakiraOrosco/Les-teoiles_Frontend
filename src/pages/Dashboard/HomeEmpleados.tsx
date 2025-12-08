import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

interface QuickAccessCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export default function HomeEmpleados() {
  const quickAccessCards: QuickAccessCard[] = [
    {
      title: "Reserva Hospedaje",
      description: "Gestionar reservas de habitaciones",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: "/AdReservas/Reserva_Hospedaje",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Reservas Evento",
      description: "Gestionar reservas de eventos",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: "/AdReservas/Reserva_Evento",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <>
      <PageMeta
        title="Dashboard Empleado - Piscina Playa Azul"
        description="Panel de control para empleados"
      />
      
      <div className="space-y-6">
        {/* Encabezado de Bienvenida */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido!</h1>
          <p className="text-blue-100">
            Gestiona las reservas de hospedaje y eventos desde aquí
          </p>
        </div>

        {/* Tarjetas de Acceso Rápido */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Acceso Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {quickAccessCards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        <p className="text-sm opacity-90">{card.description}</p>
                      </div>
                      <div className="ml-4 opacity-80 group-hover:opacity-100 transition-opacity">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Ir al módulo
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Activo</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Turno</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Día</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rol</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Empleado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ayuda Rápida */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Ayuda
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                Selecciona una de las opciones anteriores para comenzar a gestionar las reservas. 
                Si necesitas ayuda, contacta al administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}