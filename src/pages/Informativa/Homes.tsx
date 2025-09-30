import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Waves, Hotel, Calendar, Sparkles } from 'lucide-react';
import Footer from '../../components/FooterHeader/Footer';
import Header from '../../components/FooterHeader/Header';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);



  const slides = [
    {
      image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200",
      title: "Bienvenidos a Piscina Playa Azul",
      subtitle: "Tu paraíso de descanso y diversión"
    },
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      title: "Instalaciones Modernas",
      subtitle: "Comodidad y lujo para toda la familia"
    },
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
      title: "Eventos Especiales",
      subtitle: "Celebra momentos inolvidables con nosotros"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Carousel */}
      <section className="relative h-96 md:h-[500px] overflow-hidden" id="inicio">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-cyan-900/50 z-10" />
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center z-20 text-white text-center px-4">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl text-cyan-200">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Información de la Empresa */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-teal-800 mb-4">Descubre Playa Azul</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Desde hace más de 20 años, Piscina Playa Azul ha sido el destino favorito de familias y amigos que buscan relajación, diversión y momentos inolvidables. Ubicados en un entorno natural privilegiado, ofrecemos instalaciones de primer nivel para garantizar tu comodidad.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Nuestras piscinas cristalinas, áreas verdes y espacios recreativos están diseñados para que disfrutes al máximo. Ya sea que vengas por un día de campo, te hospedes en nuestras cómodas habitaciones o celebres un evento especial, estamos aquí para hacer tu experiencia memorable.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">20+</div>
                <div className="text-sm text-gray-500">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">5000+</div>
                <div className="text-sm text-gray-500">Clientes satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">50+</div>
                <div className="text-sm text-gray-500">Eventos realizados</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400" alt="Piscina" className="rounded-lg shadow-lg h-48 object-cover" />
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" alt="Hotel" className="rounded-lg shadow-lg h-48 object-cover mt-8" />
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" alt="Eventos" className="rounded-lg shadow-lg h-48 object-cover" />
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" alt="Servicios" className="rounded-lg shadow-lg h-48 object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-gradient-to-br from-lavender-100 to-cyan-50 py-16" id="servicios">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-teal-800 mb-12">Nuestros Servicios</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Piscina */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Waves className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold text-teal-700 mb-3">Piscinas</h4>
                <p className="text-gray-600 mb-4">
                  Disfruta de nuestras amplias piscinas con agua cristalina, toboganes acuáticos y áreas para niños. Perfecto para toda la familia.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>✓ Piscina olímpica</li>
                  <li>✓ Área infantil segura</li>
                  <li>✓ Toboganes y juegos</li>
                  <li>✓ Salvavidas certificados</li>
                </ul>
              </div>
            </div>

            {/* Hospedaje */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Hotel className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold text-teal-700 mb-3">Hospedaje</h4>
                <p className="text-gray-600 mb-4">
                  Habitaciones cómodas y modernas equipadas con todas las comodidades para tu estadía perfecta.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>✓ Habitaciones familiares</li>
                  <li>✓ WiFi gratis</li>
                  <li>✓ TV por cable</li>
                  <li>✓ Aire acondicionado</li>
                </ul>
              </div>
            </div>

            {/* Eventos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <Calendar className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold text-teal-700 mb-3">Eventos</h4>
                <p className="text-gray-600 mb-4">
                  Organiza tus celebraciones con nosotros. Cumpleaños, bodas, eventos corporativos y más.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>✓ Salones equipados</li>
                  <li>✓ Catering disponible</li>
                  <li>✓ Decoración incluida</li>
                  <li>✓ Capacidad hasta 200 personas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Servicios Adicionales */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Sparkles className="w-8 h-8 text-cyan-500 mr-3" />
              <h4 className="text-2xl font-bold text-teal-700">Servicios Adicionales</h4>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  🍽️
                </div>
                <h5 className="font-semibold text-gray-700">Restaurante</h5>
                <p className="text-sm text-gray-500">Comida deliciosa</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  🏐
                </div>
                <h5 className="font-semibold text-gray-700">Áreas deportivas</h5>
                <p className="text-sm text-gray-500">Canchas y juegos</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  🅿️
                </div>
                <h5 className="font-semibold text-gray-700">Estacionamiento</h5>
                <p className="text-sm text-gray-500">Amplio y seguro</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  🛡️
                </div>
                <h5 className="font-semibold text-gray-700">Seguridad 24/7</h5>
                <p className="text-sm text-gray-500">Tu tranquilidad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para vivir una experiencia inolvidable?
          </h3>
          <p className="text-xl text-cyan-100 mb-8">
            Reserva ahora y disfruta de un día lleno de diversión y relajación
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contactanos" className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Contáctanos
            </a>
            <a href="#servicios" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}