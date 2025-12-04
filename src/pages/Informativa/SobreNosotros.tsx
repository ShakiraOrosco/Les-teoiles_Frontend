import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight,  Award, Users, Heart, Target } from 'lucide-react';
import Footer from '../../components/FooterHeader/Footer';
import Header from '../../components/FooterHeader/Header';

export default function SobreNosotros() {
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const historia = [
    {
      periodo: "2012 - Los Inicios",
      año: "2012",
      titulo: "El Sueño Comienza",
      descripcion: "La construcción de nuestra piscina, a cargo del señor Edgar Martin Orosco Linares, quería sorprender a sus hijas las cuales llegaban de La Paz a vivir a este hermoso pueblo, abriendo su funcionamiento al público desde el 2013",
      imagen: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
      color: "from-cyan-400 to-teal-500"
    },
    {
      periodo: "2013 - Crecimiento",
      año: "2013",
      titulo: "Inauguración Oficial",
      descripcion: "En Septiembre de este año se da la gran inauguración de nuestra Piscina Playa Azul, se da una gran fiesta al lado de todos aquellos que vinieron para acompañarnos, junto a comida que compartio la casa; queda oficialmente abierto a todas las familias nuestra piscina",
      imagen: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800",
      color: "from-teal-500 to-cyan-600"
    },
    {
      periodo: "2015 - Expansión  ",
      año: "2015",
      titulo: "Expandiendo Horizontes",
      descripcion: "Con gran esfuerzo, la señora Wilma Gutierrez Claure y el señor Amadeo Gutierrez Claure ponen manos a la obra y abren una segunda piscina pensada ahora más que todo para los pequeños del hogar",
      imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      color: "from-cyan-500 to-teal-600"
    },
    {
      periodo: "2018 - Eventos",
      año: "2018",
      titulo: "Centro de Eventos",
      descripcion: "Para que disfruten colegios, además de abrir nuestras reservas especiales a los colegios, tambien añadimos la opción de que puedan optar para una competencia, se empieza a dar los plurinacionales de natación y de este modo juntando más a todos.",
      imagen: "https://images.unsplash.com/photo-1519167758481-83f29da8681c?w=800",
      color: "from-teal-600 to-cyan-500"
    },
    {
      periodo: "2019 - Promociones ",
      año: "2019",
      titulo: "Primeros retos por la competencia",
      descripcion: "Empezamos a convivir mucho más, empezamos a abrir ahora más promociones para que disfruten todos, aun cuando todo pareciera bueno; tambien existen sus bajas, empezamos a perder clientela por el aparecimiento de otra piscina. Aun así se sigue dando un trato muy al estilo de hogar a todos aquellos que lleguen a entrar a la psicina",
      imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      color: "from-teal-500 to-cyan-600"
    },
    {
      periodo: "2022 - La familia crece de nuevo",
      año: "2022",
      titulo: "Regresa la alegría a nuestra piscina",
      descripcion: "Tras cerrar la otra piscina, vuelven a venir más personas a compartir junto a nosotros, quiza no como era antes pero el trato hacia nuestra familia no cambia",
      imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      color: "from-teal-500 to-cyan-600"
    },
    {
      periodo: "2025 - Presente",
      año: "2025",
      titulo: "Líderes en Recreación",
      descripcion: "Hoy somos uno de los centros recreativos más Coaticados en la Ciudad Reyes-Beni. Con más de 12 años de experiencia, seguimos comprometidos con brindar las mejores experiencias a nuestras familias bolivianas y extranjeras.",
      imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      color: "from-teal-500 to-cyan-600"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentPeriod((prev) => (prev + 1) % historia.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isPlaying, historia.length]);

  const nextPeriod = () => {
    setCurrentPeriod((prev) => (prev + 1) % historia.length);
    setIsPlaying(false);
  };

  const prevPeriod = () => {
    setCurrentPeriod((prev) => (prev - 1 + historia.length) % historia.length);
    setIsPlaying(false);
  };

  // CORRECCIÓN: Agregar tipado al parámetro index
  const goToPeriod = (index: number) => {
    setCurrentPeriod(index);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center" id="Banner-Sobre-Nosotros">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" id="Titulo-Nuestra-Historia">Nuestra Historia</h2>
          <p className="text-xl text-cyan-100" id="Descripcion-Nuestra-Historia">Más de 25 años creando momentos inolvidables</p>
        </div>
      </section>

      {/* Timeline Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative">
          {/* Main Carousel */}
          <div className="relative h-[600px] overflow-hidden rounded-2xl shadow-2xl">
            {historia.map((periodo, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === currentPeriod 
                    ? 'opacity-100 translate-x-0' 
                    : index < currentPeriod 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${periodo.color} opacity-90`} />
                <img 
                  src={periodo.imagen} 
                  alt={periodo.titulo} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <div className="max-w-3xl text-white text-center">
                    <div className="mb-6">
                      <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold mb-4">
                        {periodo.periodo}
                      </div>
                      <h2 className="text-6xl md:text-8xl font-bold mb-2 opacity-50">{periodo.año}</h2>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6">{periodo.titulo}</h3>
                    <p className="text-xl md:text-2xl leading-relaxed">
                      {periodo.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevPeriod}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 p-4 rounded-full backdrop-blur-sm transition shadow-lg"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          <button 
            onClick={nextPeriod}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 p-4 rounded-full backdrop-blur-sm transition shadow-lg"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Timeline Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
            {historia.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPeriod(index)}
                className={`transition-all ${
                  index === currentPeriod 
                    ? 'w-12 h-4 bg-white rounded-full' 
                    : 'w-4 h-4 bg-white/50 rounded-full hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-30 bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition"
          >
            {isPlaying ? (
              <span className="text-white text-xl">⏸</span>
            ) : (
              <span className="text-white text-xl">▶</span>
            )}
          </button>
        </div>

        {/* Timeline Navigation */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {historia.map((periodo, index) => (
            <button
              key={index}
              onClick={() => goToPeriod(index)}
              className={`p-4 rounded-lg transition-all ${
                index === currentPeriod
                  ? 'bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <div className="text-2xl font-bold mb-1">{periodo.año}</div>
              <div className="text-xs">{periodo.periodo.split(' - ')[1]}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-teal-800 mb-12">Nuestros Valores</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-teal-700 mb-2">Excelencia</h4>
              <p className="text-gray-600">Buscamos la perfección en cada detalle para garantizar tu satisfacción.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-teal-700 mb-2">Familia</h4>
              <p className="text-gray-600">Creemos en los valores familiares y creamos espacios para unir a las personas.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-teal-700 mb-2">Pasión</h4>
              <p className="text-gray-600">Amamos lo que hacemos y eso se refleja en cada servicio que brindamos.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-teal-700 mb-2">Compromiso</h4>
              <p className="text-gray-600">Estamos comprometidos con tu bienestar y la creación de experiencias únicas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-gradient-to-br from-cyan-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-teal-800 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Proporcionar experiencias de recreación, descanso y celebración de la más alta calidad,
                Brindar felicidad y amor; relájate y disfruta bajo el sol que te abraza. 
                Sé uno más de nuestra familia, sé parte de Playa Azul
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-teal-800 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser reconocidos y ser el destino favorito para la recreación y el descanso, 
                brindando una experiencia refrescante y agradable con servicios de piscina, 
                snacks y productos de calidad en Playa Azul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sé Parte de Nuestra Historia
          </h3>
          <p className="text-xl text-cyan-100 mb-8">
            Ven y crea tus propios recuerdos en Piscina Playa Azul
          </p>
         
        </div>
      </section>
        {/* llamamos al Footer*/}
                <Footer />
    </div>
  );
}