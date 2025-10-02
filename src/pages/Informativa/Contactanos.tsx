import { useState, ChangeEvent, FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Footer from '../../components/FooterHeader/Footer';
import Header from '../../components/FooterHeader/Header';
import MapboxMap from '../../components/MapBox/MapboxMap';
import {
  validarNombreContacto,
  validarEmailContacto,
  validarTelefonoContacto,
  validarAsuntoContacto,
  validarMensajeContacto,
  validarFormularioContacto
} from '../../components/utils/validaciones';

export default function Contactanos() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  const [errores, setErrores] = useState({
    nombre: null as string | null,
    email: null as string | null,
    telefono: null as string | null,
    asunto: null as string | null,
    mensaje: null as string | null
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    telefono: false,
    asunto: false,
    mensaje: false
  });

  // Validar campo individual
  const validarCampo = (nombre: string, valor: string) => {
    let error: string | null = null;
    
    switch (nombre) {
      case 'nombre':
        error = validarNombreContacto(valor);
        break;
      case 'email':
        error = validarEmailContacto(valor);
        break;
      case 'telefono':
        error = validarTelefonoContacto(valor);
        break;
      case 'asunto':
        error = validarAsuntoContacto(valor);
        break;
      case 'mensaje':
        error = validarMensajeContacto(valor);
        break;
    }
    
    return error;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Para el teléfono, limitar a 8 dígitos
    let valorFinal = value;
    if (name === 'telefono' && value.length > 8) {
      valorFinal = value.slice(0, 8);
    }
    
    setFormData({
      ...formData,
      [name]: valorFinal
    });
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name as keyof typeof touched]) {
      const error = validarCampo(name, valorFinal);
      setErrores({
        ...errores,
        [name]: error
      });
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validarCampo(name, value);
    setErrores({
      ...errores,
      [name]: error
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({
      nombre: true,
      email: true,
      telefono: true,
      asunto: true,
      mensaje: true
    });
    
    // Validar todos los campos
    const erroresValidacion = validarFormularioContacto(formData);
    setErrores(erroresValidacion);
    
    // Verificar si hay errores
    const hayErrores = Object.values(erroresValidacion).some(error => error !== null);
    
    if (!hayErrores) {
      // Formulario válido, proceder con el envío
      console.log('Formulario válido, datos:', formData);
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
        setErrores({ nombre: null, email: null, telefono: null, asunto: null, mensaje: null });
        setTouched({ nombre: false, email: false, telefono: false, asunto: false, mensaje: false });
      }, 3000);
    } else {
      console.log('Formulario con errores:', erroresValidacion);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="bg-white rounded-xl shadow-lg p-8">
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

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Nombre */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                    errores.nombre && touched.nombre
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-cyan-500'
                  }`}
                  placeholder="Juan Pérez"
                />
                {errores.nombre && touched.nombre && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errores.nombre}</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                      errores.email && touched.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-cyan-500'
                    }`}
                    placeholder="juan@email.com"
                  />
                  {errores.email && touched.email && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>{errores.email}</span>
                    </div>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Teléfono <span className="text-gray-400 text-sm">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      // Bloquear: e, E, +, -, ., y teclas de flechas
                      if (
                        e.key === 'e' || 
                        e.key === 'E' || 
                        e.key === '+' || 
                        e.key === '-' || 
                        e.key === '.'
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()} // Desactivar scroll del mouse
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      errores.telefono && touched.telefono
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-cyan-500'
                    }`}
                    placeholder="73031166"
                    maxLength={8}
                  />
                  {errores.telefono && touched.telefono && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>{errores.telefono}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Asunto *</label>
                <select
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                    errores.asunto && touched.asunto
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-cyan-500'
                  }`}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="reserva">Reserva de instalaciones</option>
                  <option value="hospedaje">Información de hospedaje</option>
                  <option value="eventos">Organización de eventos</option>
                  <option value="tarifas">Consulta de tarifas</option>
                  <option value="otro">Otro</option>
                </select>
                {errores.asunto && touched.asunto && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errores.asunto}</span>
                  </div>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mensaje * <span className="text-gray-400 text-sm">({formData.mensaje.trim().length}/500)</span>
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  maxLength={500}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition resize-none ${
                    errores.mensaje && touched.mensaje
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-cyan-500'
                  }`}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
                {errores.mensaje && touched.mensaje && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errores.mensaje}</span>
                  </div>
                )}
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
                    <p className="text-gray-600">Ciudad Reyes, Beni</p>
                    <p className="text-gray-600">Calle Comercio esquina Calle Libertad N°500</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Teléfonos</h4>
                    <p className="text-gray-600">(+591) 73031166 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Correo electrónico</h4>
                    <p className="text-gray-600">edgaroroscolinares@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Horario de atención</h4>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 AM - 21:00 PM</p>
                    <p className="text-gray-600">Sábados y Domingos: 9:00 AM - 21:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-8">Síguenos en redes sociales</h4>
                <div className="flex gap-2">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100064178917018&rdid=QrbVgCSLfQbDyEav&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Dbfv1194f%2F#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      className="w-8 h-8"
                    >
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/>
                    </svg>
                  </a>

                  <a 
                    href="https://www.instagram.com/piscina_playa_azul?igsh=c2hvbG10cWpycDFz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      className="w-8 h-8"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.314.975.975 1.252 2.242 1.314 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.314 3.608-.975.975-2.242 1.252-3.608 1.314-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.314-.975-.975-1.252-2.242-1.314-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.314-3.608.975-.975 2.242-1.252 3.608-1.314C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.592.417 3.603 1.406 2.615 2.395 2.328 3.578 2.27 4.855.013 8.332 0 8.741 0 12s.013 3.668.072 4.948c.058 1.277.345 2.46 1.333 3.449.989.989 2.172 1.276 3.449 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.058 2.46-.345 3.449-1.333.989-.989 1.276-2.172 1.334-3.449C23.987 15.668 24 15.259 24 12s-.013-3.668-.072-4.948c-.058-1.277-.345-2.46-1.334-3.449-.989-.989-2.172-1.276-3.449-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.879 1.44 1.44 0 0 0 0-2.879z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <br /><br /><br />
        
        {/* Mapa */}
        <MapboxMap 
          latitude={-14.29522} 
          longitude={-67.33586}
          address="SN 73031166, Reyes, Beni, Bolivia"
        />
        
        <br /><br />
        
        {/* Preguntas Frecuentes */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl shadow-lg p-8 w-full">
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
      </section>

      <Footer />
    </div>
  );
}