// Archivo: src/pages/Reservas/Reservas.tsx
import { useState } from 'react';
import { Calendar, Users, Sparkles, X } from 'lucide-react';
import Header from '../../components/FooterHeader/Header';
import Footer from '../../components/FooterHeader/Footer';
import Hospedaje from './Reserva_Hospedaje';
import Eventos from './Reserva_Eventos';

export default function Reservas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'hospedaje' | 'eventos' | null>(null);

  const openModal = (type: 'hospedaje' | 'eventos') => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sistema de Reservas</h1>
          <p className="text-xl md:text-2xl text-cyan-100">
            Reserva tu espacio de forma rápida y sencilla
          </p>
        </div>
      </div>

      {/* Información de Reservas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-teal-900 mb-6 text-center">
            ¿Por qué reservar con nosotros?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Proceso Rápido</h3>
              <p className="text-gray-600">
                Realiza tu reserva en minutos sin necesidad de crear una cuenta
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Confirmación Inmediata</h3>
              <p className="text-gray-600">
                Recibe tu código de reserva al instante para confirmar tu lugar
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Pago Seguro</h3>
              <p className="text-gray-600">
                Adelanto del 50% mediante QR para garantizar tu reserva
              </p>
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-600">
            <h4 className="font-semibold text-teal-900 mb-2">Información Importante:</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Se requiere un adelanto del 50% para confirmar la reserva</li>
              <li>• Recibirás un código único que deberás presentar en las instalaciones</li>
              <li>• El personal de administración verificará tu reserva dentro de las 24 horas</li>
              <li>• Las reservas están sujetas a disponibilidad</li>
            </ul>
          </div>
        </div>

        {/* Botones de Reserva */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <button
            onClick={() => openModal('hospedaje')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-teal-500"
          >
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-teal-900 mb-2">Reserva de Hospedaje</h3>
            <p className="text-gray-600">
              Reserva habitaciones cómodas y seguras para tu estadía
            </p>
          </button>

          <button
            onClick={() => openModal('eventos')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-teal-500"
          >
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-teal-900 mb-2">Reserva de Eventos</h3>
            <p className="text-gray-600">
              Organiza eventos especiales en nuestras instalaciones
            </p>
          </button>
        </div>
      </div>

      {/* Modal de Formulario */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              {modalType === 'hospedaje' ? <Hospedaje /> : <Eventos />}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}