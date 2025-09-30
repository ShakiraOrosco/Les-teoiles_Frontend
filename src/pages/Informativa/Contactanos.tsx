import { useState, ChangeEvent, FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Footer from '../../components/FooterHeader/Footer';
import Header from '../../components/FooterHeader/Header';

export default function Contactanos() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Corrección: Agregar el tipo ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // También es buena práctica tipar el evento del submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    }, 3000);
  };

  // El resto del código permanece igual...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
        <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h2>
          <p className="text-xl text-cyan-100">Estamos aquí para ayudarte. ¡Escríbenos!</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-8 ">
            <h3 className="text-2xl font-bold text-teal-800 mb-6">Envíanos un mensaje</h3>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-green-800 font-semibold">¡Mensaje enviado con éxito!</p>
                  <p className="text-green-600 text-sm">Te responderemos pronto.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="juan@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="+591 12345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Asunto *</label>
                <select
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="reserva">Reserva de instalaciones</option>
                  <option value="hospedaje">Información de hospedaje</option>
                  <option value="eventos">Organización de eventos</option>
                  <option value="tarifas">Consulta de tarifas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mensaje *</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Mensaje</span>
              </button>
            </form>
          </div>

          {/* Información de Contacto y Mapa */}
          <div className="space-y-8">
            {/* Información de Contacto */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-teal-800 mb-6">Información de contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Dirección</h4>
                    <p className="text-gray-600">Av. Principal 123, Zona Sur</p>
                    <p className="text-gray-600">La Paz, Bolivia</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Teléfonos</h4>
                    <p className="text-gray-600">+591 2 123 4567</p>
                    <p className="text-gray-600">+591 789 12345 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Correo electrónico</h4>
                    <p className="text-gray-600">info@piscinaplayaazul.com</p>
                    <p className="text-gray-600">reservas@piscinaplayaazul.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Horario de atención</h4>
                    <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sábados y Domingos: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Síguenos en redes sociales</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition">
                    <span className="text-lg">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition">
                    <span className="text-lg">📷</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition">
                    <span className="text-lg">▶</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
           {/* Mapa */}
            <div className="bg-white rounded-xl shadow-lg p-8 w-full col-span-full">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Encuéntranos</h3>
              <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30689.19469364768!2d-68.13169!3d-16.49959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f2062a18f965b%3A0x14d8d1a0f12cf282!2sLa%20Paz%2C%20Bolivia!5e0!3m2!1ses!2sbo!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                📍 Estamos ubicados en la Zona Sur de La Paz, de fácil acceso
              </p>
            </div>

            {/* Preguntas Frecuentes */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl shadow-lg p-8 w-full col-span-full">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Preguntas frecuentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">¿Necesito reservar con anticipación?</h4>
                  <p className="text-gray-600 text-sm">Para eventos y hospedaje sí. Para uso de piscinas en días regulares no es necesario.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">¿Aceptan tarjetas de crédito?</h4>
                  <p className="text-gray-600 text-sm">Sí, aceptamos todas las tarjetas principales y transferencias bancarias.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">¿Hay estacionamiento disponible?</h4>
                  <p className="text-gray-600 text-sm">Sí, contamos con amplio estacionamiento gratuito para nuestros visitantes.</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* llamamos al Footer */}
            <Footer />
    </div>
  );
}