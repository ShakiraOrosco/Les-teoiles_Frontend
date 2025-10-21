import { useState, useEffect, useMemo } from 'react';
import { Sparkles, CheckCircle, Copy, X, Upload, Check, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useCreateReservaEvento } from '../../hooks/ReservaEvento/useCreateReservaEvento';
import { useUploadComprobanteEvento } from '../../hooks/ReservaEvento/useUploadComprobanteEvento';
import { useServiciosAdicionales } from '../../hooks/ReservaEvento/useServiciosAdicionales';

export default function Eventos() {
  const { crearReservaEvento, isLoading, error, resetState } = useCreateReservaEvento();
  const { subirComprobante, isLoading: isUploadingComprobante, error: uploadError } = useUploadComprobanteEvento();
  const { servicios, isLoading: isLoadingServicios } = useServiciosAdicionales();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
    carnet: '',
    fechaEvento: '',
    cantidadPersonas: '',
    tipoReserva: '',
    horaInicio: '',
    horaFin: '',
    serviciosAdicionales: [] as number[],
  });

  const [step, setStep] = useState<'form' | 'waiting' | 'payment' | 'success'>('form');
  const [segundos, setSegundos] = useState(30);
  const [reservaGenId, setReservaGenId] = useState<number | null>(null);
  const [codigoReserva, setCodigoReserva] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  // Calcular el precio total en tiempo real
  const precioTotal = useMemo(() => {
    let total = 0;
    
    // Primero obtenemos los servicios seleccionados
    const serviciosSeleccionados = servicios.filter(servicio => 
      formData.serviciosAdicionales.includes(servicio.id_servicios_adicionales)
    );

    // Calculamos el total según el tipo de cada servicio
    serviciosSeleccionados.forEach(servicio => {
      if (servicio.tipo === 'A') {
        // Tipo A: se multiplica por la cantidad de personas
        const cantidadPersonas = parseInt(formData.cantidadPersonas) || 1;
        total += servicio.precio * cantidadPersonas;
      } else if (servicio.tipo === 'E') {
        // Tipo E: precio fijo
        total += servicio.precio;
      } else {
        // Por defecto, precio fijo
        total += servicio.precio;
      }
    });

    return total;
  }, [formData.serviciosAdicionales, formData.cantidadPersonas, servicios]);

  // Calcular el 50% para el adelanto
  const precioAdelanto = useMemo(() => {
    return precioTotal / 2;
  }, [precioTotal]);

  // Obtener servicios seleccionados para mostrar detalles
  const serviciosSeleccionados = useMemo(() => {
    return servicios.filter(servicio => 
      formData.serviciosAdicionales.includes(servicio.id_servicios_adicionales)
    );
  }, [formData.serviciosAdicionales, servicios]);

  useEffect(() => {
    if (step === 'waiting' && segundos > 0) {
      const timer = setTimeout(() => setSegundos(segundos - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'waiting' && segundos === 0) {
      setStep('payment');
    }
  }, [step, segundos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (servicioId: number) => {
    setFormData(prev => ({
      ...prev,
      serviciosAdicionales: prev.serviciosAdicionales.includes(servicioId)
        ? prev.serviciosAdicionales.filter(id => id !== servicioId)
        : [...prev.serviciosAdicionales, servicioId]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setComprobante(e.target.files[0]);
    }
  };

  const handleContinuarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStep('waiting');
    setSegundos(30);

    try {
      const result = await crearReservaEvento(formData);
      if (result && result.reserva_gen_id) {
        setReservaGenId(result.reserva_gen_id);
      } else {
        throw new Error('No se recibió el ID de la reserva del servidor');
      }
    } catch (err) {
      console.error('Error en el submit:', err);
      setStep('form');
    }
  };

  const handleUploadComprobante = async () => {
    if (!comprobante || reservaGenId === null) {
      console.error('Falta comprobante o reservaGenId');
      return;
    }

    try {
      const result = await subirComprobante(reservaGenId, comprobante);
      setCodigoReserva(result.reserva_gen_id?.toString() || '');
      setStep('success');
    } catch (err) {
      console.error('Error uploading comprobante:', err);
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoReserva);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const resetearFormulario = () => {
    setFormData({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      email: '',
      carnet: '',
      fechaEvento: '',
      cantidadPersonas: '',
      tipoReserva: '',
      horaInicio: '',
      horaFin: '',
      serviciosAdicionales: [],
    });
    setStep('form');
    setComprobante(null);
    setReservaGenId(null);
    setCodigoReserva('');
    setCopiado(false);
    setMostrarCalendario(false);
    setFechaSeleccionada(null);
    resetState();
  };

  // Funciones del calendario
  const obtenerDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasDelMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay();
    
    const dias: (number | null)[] = [];
    
    // Llenar días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push(null);
    }
    
    // Llenar días del mes
    for (let dia = 1; dia <= diasDelMes; dia++) {
      dias.push(dia);
    }
    
    return dias;
  };

  const cambiarMes = (direccion: number) => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevaFecha);
  };

  const seleccionarFecha = (dia: number) => {
    const nuevaFecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    setFechaSeleccionada(nuevaFecha);
    
    // Formatear fecha para el input (YYYY-MM-DD)
    const fechaFormateada = nuevaFecha.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, fechaEvento: fechaFormateada }));
    setMostrarCalendario(false);
  };

  const esFechaPasada = (dia: number) => {
    const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy;
  };

  const esFechaSeleccionada = (dia: number) => {
    if (!fechaSeleccionada) return false;
    return (
      fechaSeleccionada.getDate() === dia &&
      fechaSeleccionada.getMonth() === mesActual.getMonth() &&
      fechaSeleccionada.getFullYear() === mesActual.getFullYear()
    );
  };

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center relative">
          <button onClick={resetearFormulario} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" title="Cerrar">
            <X className="w-6 h-6" />
          </button>

          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-teal-800 mb-2">¡Reserva Exitosa!</h2>
          <p className="text-gray-600 mb-6">Tu pago del 50% ha sido recibido correctamente</p>

          <div className="bg-teal-50 rounded-lg p-6 mb-4">
            <p className="text-sm text-gray-600 mb-2">Tu código de reserva es:</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-mono font-bold text-teal-700">
                {codigoReserva}
              </p>
              <button onClick={copiarCodigo} className="p-2 hover:bg-teal-100 rounded-lg transition" title="Copiar código">
                {copiado ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-teal-600" />}
              </button>
            </div>
            {copiado && <p className="text-xs text-teal-600 mt-2">✓ Copiado</p>}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left mb-6">
            <p className="text-sm text-yellow-800 font-semibold">
              Importante: Guarda este código para confirmar tu reserva en las instalaciones.
            </p>
          </div>

          <button onClick={resetearFormulario} className="w-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (step === 'waiting') {
    return (
      <div className="min-h-screen bg-teal-50 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-teal-800 mb-3">Analizando tu Solicitud</h2>
          <p className="text-gray-600 mb-8">
            Por favor espera mientras verificamos los requisitos y disponibilidad de los servicios solicitados.
          </p>
          
          <div className="text-5xl font-bold text-teal-600">{segundos}s</div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 to-teal-50 p-4">
        <div className="w-full max-w-2xl relative">
          <button onClick={() => setStep('form')} className="absolute -top-10 right-0 text-gray-400 hover:text-gray-600 transition z-50">
            <X className="w-6 h-6" />
          </button>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="text-center pt-8 pb-6 px-8">
              <h2 className="text-4xl font-bold text-teal-900 mb-2">Realizar Pago</h2>
              <p className="text-gray-600">Necesitamos el 50% de adelanto para confirmar tu reserva</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8 pt-0">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-teal-400/30 rounded-2xl blur-2xl"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-cyan-100/50">
                    <img src="../images/ReservaPagos/ResEvento2.jpg" alt="Código QR de pago" className="w-56 h-56 rounded-xl" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Escanea con tu aplicación bancaria</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Altoke - Pago seguro</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                {/* Resumen de precios */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200/50">
                    <p className="text-sm text-gray-600 mb-2">Total de servicios:</p>
                    <div className="flex items-baseline gap-2 mb-2 justify-center">
                      <span className="text-3xl font-bold text-teal-700">{precioTotal.toFixed(2)}</span>
                      <span className="text-lg font-semibold text-teal-600">Bs.</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                    <p className="text-sm text-gray-600 mb-2">Monto a pagar (50%):</p>
                    <div className="flex items-baseline gap-2 mb-2 justify-center">
                      <span className="text-4xl font-bold text-amber-700">{precioAdelanto.toFixed(2)}</span>
                      <span className="text-lg font-semibold text-amber-600">Bs.</span>
                    </div>
                    <p className="text-xs text-gray-500">(50% de adelanto)</p>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-6">
                  <p className="text-sm text-amber-900"><strong>Importante:</strong> El restante 50% ({precioAdelanto.toFixed(2)} Bs.) se pagará en recepción</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📎 Comprobante de Pago
                  </label>
                  
                  <div className="relative group">
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept="image/*,.pdf" 
                      className="hidden" 
                      id="comprobante" 
                    />
                    
                    {!comprobante ? (
                      <label 
                        htmlFor="comprobante" 
                        className="block cursor-pointer"
                      >
                        <div className="relative border-3 border-dashed border-gray-300 group-hover:border-teal-400 rounded-2xl p-8 text-center transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group-hover:from-teal-50 group-hover:to-cyan-50">
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 to-cyan-400/0 group-hover:from-teal-400/10 group-hover:to-cyan-400/10 rounded-2xl transition-all duration-300"></div>
                          
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                              <Upload className="w-8 h-8 text-teal-600" />
                            </div>
                            
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                              Arrastra tu archivo aquí
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                              o haz clic para seleccionar
                            </p>
                            
                            <div className="inline-block px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium group-hover:shadow-lg transition-all duration-300">
                              Seleccionar archivo
                            </div>
                            
                            <p className="text-xs text-gray-400 mt-4">
                              PNG, JPG o PDF (máx. 5MB)
                            </p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="border-3 border-teal-400 rounded-2xl p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Check className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 mb-1">Archivo cargado</p>
                            <p className="text-sm text-gray-600 truncate">{comprobante.name}</p>
                            <p className="text-xs text-teal-600 mt-1">
                              ✓ Listo para enviar
                            </p>
                          </div>
                          
                          <label 
                            htmlFor="comprobante"
                            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                          >
                            Cambiar
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                    <p>Asegúrate de que el comprobante sea legible y contenga todos los datos del pago</p>
                  </div>
                </div>

                <button onClick={handleUploadComprobante} disabled={!comprobante || isUploadingComprobante} className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${comprobante && !isUploadingComprobante ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  {isUploadingComprobante ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    `Confirmar Pago - ${precioAdelanto.toFixed(2)} Bs.`
                  )}
                </button>

                {uploadError && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg">Error: {uploadError}</div>}
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-8 py-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-600">💳 Pago 100% seguro • Los datos están protegidos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-teal-800">Reserva de Eventos</h2>
          <p className="text-gray-600 mt-2">Completa el formulario para realizar tu solicitud</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>}

        <form onSubmit={handleContinuarPago} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">
              Datos Personales
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno *
                </label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ej: Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno *
                </label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ej: García"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="7XXXXXXX"
                  maxLength={8}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carnet de Identidad *
                </label>
                <input
                  type="text"
                  name="carnet"
                  value={formData.carnet}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="XXXXXXXX"
                  maxLength={12}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">
              Detalles de la Reserva
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Reserva *
              </label>
              <select
                name="tipoReserva"
                value={formData.tipoReserva}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione un tipo de evento</option>
                <option value="cumpleaños">Cumpleaños</option>
                <option value="boda">Boda</option>
                <option value="reunion">Reunión Familiar</option>
                <option value="corporativo">Evento Corporativo</option>
                <option value="graduacion">Graduación</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Evento *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMostrarCalendario(!mostrarCalendario)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-left flex items-center justify-between bg-white"
                >
                  <span className={formData.fechaEvento ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.fechaEvento 
                      ? new Date(formData.fechaEvento + 'T00:00:00').toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Seleccione una fecha'}
                  </span>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </button>

                {mostrarCalendario && (
                  <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-full md:w-96">
                    {/* Header del calendario */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => cambiarMes(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <h3 className="text-lg font-semibold text-gray-800">
                        {mesesNombres[mesActual.getMonth()]} {mesActual.getFullYear()}
                      </h3>
                      
                      <button
                        type="button"
                        onClick={() => cambiarMes(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {diasSemana.map(dia => (
                        <div key={dia} className="text-center text-xs font-semibold text-gray-600 py-2">
                          {dia}
                        </div>
                      ))}
                    </div>

                    {/* Días del mes */}
                    <div className="grid grid-cols-7 gap-1">
                      {obtenerDiasDelMes(mesActual).map((dia, index) => (
                        <div key={index} className="aspect-square">
                          {dia ? (
                            <button
                              type="button"
                              onClick={() => !esFechaPasada(dia) && seleccionarFecha(dia)}
                              disabled={esFechaPasada(dia)}
                              className={`w-full h-full rounded-lg text-sm font-medium transition-all ${
                                esFechaPasada(dia)
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : esFechaSeleccionada(dia)
                                  ? 'bg-teal-500 text-white shadow-lg scale-105'
                                  : 'hover:bg-teal-50 text-gray-700 hover:text-teal-600'
                              }`}
                            >
                              {dia}
                            </button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Botón cerrar */}
                    <button
                      type="button"
                      onClick={() => setMostrarCalendario(false)}
                      className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin *
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Personas *
              </label>
              <input
                type="number"
                name="cantidadPersonas"
                value={formData.cantidadPersonas}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ej: 50"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios Adicionales
              </label>
              {isLoadingServicios ? (
                <p className="text-sm text-gray-500">Cargando servicios...</p>
              ) : (
                <div className="space-y-2">
                  {servicios.map((servicio) => (
                    <label key={servicio.id_servicios_adicionales} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={formData.serviciosAdicionales.includes(servicio.id_servicios_adicionales)}
                        onChange={() => handleCheckboxChange(servicio.id_servicios_adicionales)}
                        className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">{servicio.nombre}</span>
                        <p className="text-xs text-gray-500">{servicio.descripcion}</p>
                        <p className="text-xs text-teal-600 font-medium">
                          Tipo: {servicio.tipo} - 
                          {servicio.tipo === 'A' 
                            ? ` ${servicio.precio.toFixed(2)} Bs. por persona` 
                            : ` ${servicio.precio.toFixed(2)} Bs. (precio fijo)`}
                        </p>
                      </div>
                      <span className="text-teal-600 font-semibold">{servicio.precio.toFixed(2)} Bs.</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resumen de precios - Diseño mejorado */}
          <div className="bg-white rounded-2xl border-2 border-teal-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Resumen de tu Reserva
              </h3>
            </div>
            
            {serviciosSeleccionados.length > 0 ? (
              <div className="p-6 space-y-4">
                {/* Lista de servicios */}
                <div className="space-y-3">
                  {serviciosSeleccionados.map(servicio => (
                    <div key={servicio.id_servicios_adicionales} className="flex justify-between items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{servicio.nombre}</p>
                        {servicio.tipo === 'A' && formData.cantidadPersonas && (
                          <p className="text-sm text-gray-500 mt-1">
                            {servicio.precio.toFixed(2)} Bs. × {formData.cantidadPersonas} persona{parseInt(formData.cantidadPersonas) > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-teal-600">
                          {servicio.tipo === 'A' && formData.cantidadPersonas
                            ? `${(servicio.precio * parseInt(formData.cantidadPersonas)).toFixed(2)}`
                            : `${servicio.precio.toFixed(2)}`
                          } <span className="text-sm">Bs.</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totales */}
                <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-200">
                  <div className="flex justify-between items-center p-4 bg-teal-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-teal-700">{precioTotal.toFixed(2)} <span className="text-lg">Bs.</span></span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                    <div>
                      <p className="text-gray-700 font-semibold">Adelanto (50%)</p>
                      <p className="text-xs text-gray-500">A pagar ahora</p>
                    </div>
                    <span className="text-3xl font-bold text-amber-600">{precioAdelanto.toFixed(2)} <span className="text-xl">Bs.</span></span>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Restante:</strong> {precioAdelanto.toFixed(2)} Bs. se pagará en recepción
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Selecciona servicios adicionales</p>
                <p className="text-sm text-gray-400">para ver el monto total de tu reserva</p>
                <div className="mt-4 inline-block px-6 py-2 bg-gray-100 rounded-lg">
                  <p className="text-3xl font-bold text-gray-400">0.00 <span className="text-xl">Bs.</span></p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-4 rounded-lg hover:shadow-lg transition font-semibold text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Enviando...' : `Enviar Solicitud - ${precioAdelanto.toFixed(2)} Bs.`}
          </button>
        </form>
      </div>
    </div>
  );
}