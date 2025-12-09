// pages/Home/index.tsx
import { useState, useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";

interface Auditoria {
  id: number;
  usuario: number;
  username: string | null;
  usuario_nombre: string | null;
  accion: string;
  tabla: string;
  descripcion: string;
  fecha: string;
  hora: string;
}

export default function Home() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const getAuthToken = () => {
    try {
      // El token está guardado directamente en localStorage.access
      const token = localStorage.getItem("access");
      return token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  };

  const obtenerAuditorias = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch(`${API_URL}/auditoria/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener auditorías: ${response.status}`);
      }

      const data = await response.json();
      setAuditorias(data);
      console.log('Auditorías obtenidas:', data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching auditorías:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerAuditorias();
  }, []);

  const getAccionColor = (accion: string) => {
    const colores: { [key: string]: string } = {
      'REGISTRO': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'ACTUALIZACIÓN': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'DESACTIVACIÓN': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'INICIO DE SESIÓN': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    };
    return colores[accion] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Auditoría - Piscina Playa Azul"
          description="Registro de auditoría del sistema"
        />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando auditorías...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Auditoría - Piscina Playa Azul"
          description="Registro de auditoría del sistema"
        />
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">Error</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={obtenerAuditorias}
              className="mt-4 bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-600 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Auditoría - Piscina Playa Azul"
        description="Registro de auditoría del sistema"
      />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Registro de Auditoría</h1>
          <button
            onClick={obtenerAuditorias}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-blue-600 dark:bg-blue-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Tabla
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Hora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {auditorias.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No hay registros de auditoría
                    </td>
                  </tr>
                ) : (
                  auditorias.map((auditoria) => (
                    <tr key={auditoria.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {auditoria.usuario_nombre || 'N/A'}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {auditoria.username || 'Sin usuario'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAccionColor(auditoria.accion)}`}>
                          {auditoria.accion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {auditoria.tabla}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="max-w-xs truncate" title={auditoria.descripcion}>
                          {auditoria.descripcion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {auditoria.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {auditoria.hora}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Total de registros: {auditorias.length}
        </div>
      </div>
    </>
  );
}