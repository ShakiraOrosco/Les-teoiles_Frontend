import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle,Sparkles } from 'lucide-react';
import Footer from '../../components/FooterHeader/Footer';
import Header from '../../components/FooterHeader/Header';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);



  const slides = [
    {
      image: "/images/Informativa/Piscina.jpg",
      title: "Bienvenidos a Piscina Playa Azul",
      subtitle: "Tu paraíso de descanso y diversión"
    },
    {
      image: "/images/Informativa/Banner.jpg",
    },
    {
      image: "/images/Informativa/Comodidad.png",
      title: "Hospedaje Confortable",
      subtitle: "Comodidad para toda la familia y/o Amigos"
    },
    {
      image: "/images/Informativa/Evento2.png",
      title: "Reserva de Eventos ",
      subtitle: "Celebra momentos inolvidables con Familiares y/o Amigos en nuestro establecimiento"
    },
    
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
              Trabajando a tu lado desde 2013, Playa Azul es fundado por Edgar Martin Orosco Linares con el intento de unir a familias, amigos y parejas. Tras años trabajando por encontrar la formula de como unir no solo a su familia, si no a toda la comunidad.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Poco a poco fue uniendo a más familias y logrando ser conocido en la comunidad y con la esperanza puesta en abrir sus puertas a más familias.

La pasión por lo que hacemos y la dedicación de nuestro equipo han sido pilares fundamentales en nuestra trayectoria. A continuación, te invitamos a conocer algunos hitos importantes en nuestra historia a través de la línea de tiempo: </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">12+</div>
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
            <img src="../images/Informativa/PAzul.jpg" alt="Piscina" className="rounded-lg shadow-lg h-60 w-90  object-cover" />
            <img src="../images/Informativa/Comodidad.png" alt="Hotel" className="rounded-lg shadow-lg h-58 w-90 object-cover mt-8" />
            <img src="../images/Informativa/Evento2.png" alt="Eventos" className="rounded-lg shadow-lg h-48 w-90 object-cover" />
            <img src="../images/Informativa/Snack.jpg" alt="Servicios" className="rounded-lg shadow-lg h-48 w-70 object-cover mt-8" />
          </div>
        </div>
      </section>
       {/* Servicios Principales con diseño alternado */}
<section className="py-16 px-4">
  <div className="max-w-7xl mx-auto space-y-16">

    {/* Piscina - Imagen IZQUIERDA, Texto DERECHA */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="bg-gradient-to-br from-cyan-400 to-teal-500 h-70 md:h-auto flex items-center justify-center p-8">
          <img src="public/images/Informativa/PAzul.jpg" alt="Piscina" className="w-full h-full" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-teal-700 mb-4">Piscina</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Ofrece un espacio amplio y seguro para que familias y visitantes disfruten de un día de recreación y descanso. Ideal tanto para niños como para adultos que buscan relajarse o divertirse en el agua.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Espacio amplio y seguro para familias</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Ideal para niños y adultos</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Diversión garantizada con áreas de recreación</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Trato familiar y atención personalizada</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="/informacion" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">Más Información</a>
            <a href="/reserva" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition">Reservar</a>
            <a href="/apartarlugar" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">Aparta el Lugar</a>
          </div>
        </div>
      </div>
    </div>

    {/* Hospedaje - Imagen DERECHA, Texto IZQUIERDA */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <h2 className="text-3xl font-bold text-teal-700 mb-4">Hospedaje</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Habitaciones cómodas y acogedoras para quienes desean quedarse más tiempo, permitiendo prolongar la experiencia y disfrutar con tranquilidad del lugar.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Habitaciones amplias y confortables</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Permite prolongar la estadía con tranquilidad</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Ideal para toda la familia o grupos de amigos</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Ambiente acogedor y seguro</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="/informacion" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">Más Información</a>
            <a href="/reserva" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition">Reservar</a>
            <a href="/apartarlugar" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">Aparta el Lugar</a>
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 h-80 md:h-auto flex items-center justify-center p-8 order-1 md:order-2">
          <img src="public/images/Informativa/Hospedaje.jpg" alt="Hotel" className="w-full h-full" />
        </div>
      </div>
    </div>

    {/* Eventos - Imagen IZQUIERDA, Texto DERECHA */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 h-80 md:h-auto flex items-center justify-center p-8">
          <img src="public/images/informativa/Evento2.png" alt="Eventos" className="w-full h-" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-teal-700 mb-4">Eventos</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Dispone de áreas preparadas para la organización de diferentes celebraciones, como cumpleaños, reuniones familiares o actividades sociales, brindando un ambiente agradable y versátil.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Salones preparados para todo tipo de eventos</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Ambiente agradable y versátil</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Ideal para cumpleaños, reuniones familiares y eventos sociales</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Atención personalizada y servicio completo</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="/informacion" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">Más Información</a>
            <a href="/reserva" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition">Reservar</a>
            <a href="/apartarlugar" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">Aparta el Lugar</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
<br />
{/* Servicios Adicionales */}
 <section className="bg-gradient-to-br from-lavender-100 to-cyan-50 py-16" id="servicios">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-center mb-8">
      <Sparkles className="h-10 w-10 text-cyan-500 mr-3" />
      <h2 className="text-4xl font-bold text-teal-700">Servicios Adicionales</h2>
    </div>
    
    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 gap-6">

      <div className="flex items-start">
        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
        <p className="text-gray-700 text-lg">
          <span className="text-4xl mr-2">🍖</span> Parrilla para asados con utensilios básicos
        </p>
      </div>

      <div className="flex items-start">
        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
        <p className="text-gray-700 text-lg">
          <span className="text-4xl mr-2">🥤</span> Alquiler de vasos y platos para reuniones
        </p>
      </div>

      <div className="flex items-start">
        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
       <p className="text-gray-700 text-lg">
          <span className="text-4xl mr-2">🍦</span> Servicio de helados para eventos (cantidad acordada previamente)
        </p>
      </div>

      <div className="flex items-start">
        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
        <p className="text-gray-700 text-lg">
          <span className="text-4xl mr-2">🪑</span> Mesas y sillas disponibles para reuniones y celebraciones
        </p>
      </div>

      <div className="flex items-start">
        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
        <p className="text-gray-700 text-lg">
          <span className="text-4xl mr-2">🥪</span> Snacks y bebidas para complementar la visita
        </p>
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
           { /*<a href="#servicios" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition">
              Ver Servicios
            </a>*/}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}