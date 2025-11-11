import { useState, useEffect, useMemo } from 'react';
import { Sparkles, CheckCircle, Copy, X, Upload, Check, ChevronLeft, ChevronRight, Calendar, AlertCircle, User, Clock, CreditCard } from 'lucide-react';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';
import { useCreateReservaEvento } from '../../../../hooks/ReservaEvento/useCreateReservaEvento';
import { useUploadComprobanteEvento } from '../../../../hooks/ReservaEvento/useUploadComprobanteEvento';
import { useServiciosAdicionales } from '../../../../hooks/ReservaEvento/useServiciosAdicionales';
import {
  validarFormularioEvento,
  validarNombreEvento,
  validarApellidosEvento,
  validarTelefonoEvento,
  validarCIEvento,
  validarEmailEvento,
  validarFechaEvento,
  validarHoraInicio,
  validarHoraFin,
  validarCantidadPersonasEvento,
  soloNumerosEvento,
  soloLetrasEvento,
  bloquearCaracteresEspecialesEvento,
  validarComprobante
} from '../../../../components/utils/validaciones';

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'cliente' | 'evento' | 'servicios' | 'resumen' | 'waiting' | 'payment' | 'success' | 'error';

export default function EventoModal({ isOpen, onClose, onSuccess }: EventoModalProps) {
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

  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<Step>('cliente');
  const [segundos, setSegundos] = useState(20);
  const [reservaGenId, setReservaGenId] = useState<number | null>(null);
  const [codigoReserva, setCodigoReserva] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [comprobanteError, setComprobanteError] = useState<string | null>(null);
  const [errorDetallado, setErrorDetallado] = useState<string>('');

  // Validación en tiempo real para cada campo
  const validarCampo = (nombre: string, valor: string): string | null => {
    let error: string | null = null;

    switch (nombre) {
      case 'nombre':
        error = validarNombreEvento(valor);
        break;
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        const erroresApellidos = validarApellidosEvento(
          nombre === 'apellidoPaterno' ? valor : formData.apellidoPaterno,
          nombre === 'apellidoMaterno' ? valor : formData.apellidoMaterno
        );
        error = nombre === 'apellidoPaterno' ? erroresApellidos.paterno : erroresApellidos.materno;
        break;
      case 'telefono':
        error = validarTelefonoEvento(valor);
        break;
      case 'email':
        error = validarEmailEvento(valor);
        break;
      case 'carnet':
        error = validarCIEvento(valor);
        break;
      case 'fechaEvento':
        error = validarFechaEvento(valor);
        break;
      case 'cantidadPersonas':
        error = validarCantidadPersonasEvento(valor);
        break;
      case 'tipoReserva':
        error = valor ? null : "Debe seleccionar un tipo de evento";
        break;
      case 'horaInicio':
        error = validarHoraInicio(valor);
        break;
      case 'horaFin':
        error = validarHoraFin(formData.horaInicio, valor, formData.fechaEvento);
        break;
      default:
        error = null;
    }

    return error;
  };

  // Actualizar errores cuando cambia formData
  useEffect(() => {
    const nuevosErrores: Record<string, string | null> = {};
    
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        nuevosErrores[field] = validarCampo(field, formData[field as keyof typeof formData] as string);
      }
    });
    
    setErrores(nuevosErrores);
  }, [formData, touched]);

  // Calcular el precio total en tiempo real
  const precioTotal = useMemo(() => {
    let total = 0;
    
    const serviciosSeleccionados = servicios.filter(servicio => 
      formData.serviciosAdicionales.includes(servicio.id_servicios_adicionales)
    );

    serviciosSeleccionados.forEach(servicio => {
      if (servicio.tipo === 'A') {
        const cantidadPersonas = parseInt(formData.cantidadPersonas) || 1;
        total += servicio.precio * cantidadPersonas;
      } else {
        total += servicio.precio;
      }
    });

    return total;
  }, [formData.serviciosAdicionales, formData.cantidadPersonas, servicios]);

  const precioAdelanto = useMemo(() => {
    return precioTotal / 2;
  }, [precioTotal]);

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

  const handleBlur = (field: string) => {
    let valorLimpio = formData[field as keyof typeof formData] as string;
    
    if (field === 'nombre' || field === 'apellidoPaterno' || field === 'apellidoMaterno') {
      valorLimpio = valorLimpio.trim();
      setFormData(prev => ({ ...prev, [field]: valorLimpio }));
    }
    
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validarCampo(field, valorLimpio);
    setErrores(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let valorFinal = value;
    
    if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
      valorFinal = value.replace(/^\s+/, '');
      valorFinal = valorFinal.replace(/\s{2,}/g, ' ');
    }
    
    if (name === 'telefono' && valorFinal.length > 8) {
      valorFinal = valorFinal.slice(0, 8);
    }
    if (name === 'carnet' && valorFinal.length > 9) {
      valorFinal = valorFinal.slice(0, 9);
    }
    if (name === 'email') {
      valorFinal = value.replace(/\s/g, '');
    }

    if (name === 'cantidadPersonas') {
      valorFinal = value.replace(/\D/g, '');
      if (valorFinal.length > 1 && valorFinal.startsWith('0')) {
        valorFinal = valorFinal.replace(/^0+/, '');
      }
      valorFinal = valorFinal.slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: valorFinal }));

    if (touched[name]) {
      const error = validarCampo(name, valorFinal);
      setErrores(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleCheckboxChange = (servicioId: number) => {
    setFormData(prev => ({
      ...prev,
      serviciosAdicionales: prev.serviciosAdicionales.includes(servicioId)
        ? prev.serviciosAdicionales.filter(id => id !== servicioId)
        : [...prev.serviciosAdicionales, servicioId]
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setComprobanteError(null);
    
    if (!file) {
      setComprobante(null);
      return;
    }

    const error = validarComprobante(file);
    
    if (error) {
      setComprobanteError(error);
      event.target.value = '';
      setComprobante(null);
      return;
    }

    setComprobante(file);
    setComprobanteError(null);
  };

  const validarStep = (step: Step): boolean => {
    switch (step) {
      case 'cliente':
        return !errores.nombre && !errores.apellidoPaterno && !errores.telefono && 
               !errores.email && !errores.carnet && 
               !!formData.nombre && !!formData.apellidoPaterno && !!formData.telefono && 
               !!formData.email && !!formData.carnet;
      
      case 'evento':
        return !errores.tipoReserva && !errores.fechaEvento && !errores.horaInicio && 
               !errores.horaFin && !errores.cantidadPersonas &&
               !!formData.tipoReserva && !!formData.fechaEvento && !!formData.horaInicio && 
               !!formData.horaFin && !!formData.cantidadPersonas;
      
      case 'servicios':
        return true; // Los servicios son opcionales
      
      case 'resumen':
        return true;
      
      default:
        return false;
    }
  };

  const handleSiguiente = () => {
    // Validar campos del step actual
    const camposStep: Record<Step, string[]> = {
      cliente: ['nombre', 'apellidoPaterno', 'telefono', 'email', 'carnet'],
      evento: ['tipoReserva', 'fechaEvento', 'horaInicio', 'horaFin', 'cantidadPersonas'],
      servicios: [],
      resumen: [],
      waiting: [],
      payment: [],
      success: [],
      error: []
    };

    const camposAValidar = camposStep[step];
    const nuevosTouched = { ...touched };
    const nuevosErrores = { ...errores };

    camposAValidar.forEach(campo => {
      nuevosTouched[campo] = true;
      nuevosErrores[campo] = validarCampo(campo, formData[campo as keyof typeof formData] as string);
    });

    setTouched(nuevosTouched);
    setErrores(nuevosErrores);

    // Verificar si hay errores
    const hayErrores = camposAValidar.some(campo => nuevosErrores[campo]);
    
    if (hayErrores) {
      const primerCampoConError = camposAValidar.find(campo => nuevosErrores[campo]);
      if (primerCampoConError) {
        const elemento = document.querySelector(`[name="${primerCampoConError}"]`) as HTMLElement;
        if (elemento) elemento.focus();
      }
      return;
    }

    // Avanzar al siguiente step
    const steps: Step[] = ['cliente', 'evento', 'servicios', 'resumen'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleAnterior = () => {
    const steps: Step[] = ['cliente', 'evento', 'servicios', 'resumen'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleContinuarPago = async () => {
    const todosLosCampos = {
      nombre: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      telefono: true,
      email: true,
      carnet: true,
      fechaEvento: true,
      cantidadPersonas: true,
      tipoReserva: true,
      horaInicio: true,
      horaFin: true,
    };
    setTouched(todosLosCampos);

    const erroresValidacion = validarFormularioEvento(formData);
    setErrores(erroresValidacion);

    const hayErrores = Object.values(erroresValidacion).some(error => error !== null);
    
    if (hayErrores) {
      const primerCampoConError = Object.keys(erroresValidacion).find(key => erroresValidacion[key]);
      if (primerCampoConError) {
        const elemento = document.querySelector(`[name="${primerCampoConError}"]`) as HTMLElement;
        if (elemento) elemento.focus();
      }
      return;
    }

    setStep('waiting');
    setSegundos(20);

    try {
      const result = await crearReservaEvento(formData);
      if (result && result.reserva_gen_id) {
        setReservaGenId(result.reserva_gen_id);
      } else {
        throw new Error('No se recibió el ID de la reserva del servidor');
      }
    } catch (err) {
      console.error('Error en el submit:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al procesar la reserva';
      setErrorDetallado(errorMsg);
      setStep('error');
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
      
      if (onSuccess) {
        onSuccess();
      }
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
    setErrores({});
    setTouched({});
    setStep('cliente');
    setComprobante(null);
    setReservaGenId(null);
    setCodigoReserva('');
    setCopiado(false);
    setMostrarCalendario(false);
    setFechaSeleccionada(null);
    setErrorDetallado('');
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
    
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push(null);
    }
    
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
    
    const fechaFormateada = nuevaFecha.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, fechaEvento: fechaFormateada }));
    setMostrarCalendario(false);
    handleBlur('fechaEvento');
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

  if (!isOpen) return null;

  // Pantalla de error
  if (step === 'error') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="w-full bg-white rounded-2xl p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" title="Cerrar">
            <X className="w-6 h-6" />
          </button>

          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>

          <h2 className="text-3xl font-bold text-red-800 mb-2">No se pudo procesar tu reserva</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, ha ocurrido un problema</p>

          <div className="bg-red-50 rounded-lg p-6 mb-4 text-left">
            <p className="text-sm text-red-900 font-semibold mb-2">Detalles del error:</p>
            <p className="text-sm text-red-700 whitespace-pre-wrap">{errorDetallado}</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left mb-6">
            <p className="text-sm text-blue-800">
              <strong>Sugerencias:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Verifica que los servicios seleccionados estén disponibles</li>
                <li>Intenta con otra fecha u horario</li>
                <li>Si el problema persiste, contacta con soporte</li>
              </ul>
            </p>
          </div>

          <button onClick={resetearFormulario} className="w-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition font-semibold">
            Volver a intentar
          </button>
        </div>
      </Modal>
    );
  }

  if (step === 'success') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="w-full bg-white rounded-2xl p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" title="Cerrar">
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

          <button onClick={onClose} className="w-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition font-semibold">
            Cerrar
          </button>
        </div>
      </Modal>
    );
  }

  if (step === 'waiting') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="w-full bg-white rounded-2xl p-12 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-teal-800 mb-3">Analizando tu Solicitud</h2>
          <p className="text-gray-600 mb-4">
            Por favor espera mientras verificamos los requisitos y disponibilidad de los servicios solicitados.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left mb-6">
            <p className="text-sm text-blue-800">
              💡 Tu reserva está siendo procesada espera un momento porfavor.
            </p>
          </div>
          
          <div className="text-5xl font-bold text-teal-600">{segundos}s</div>
        </div>
      </Modal>
    );
  }

  if (step === 'payment') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        <div className="w-full relative">
          <button onClick={() => setStep('resumen')} className="absolute -top-10 right-0 text-gray-400 hover:text-gray-600 transition z-50">
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
                <div className="space-y-4 mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante de Pago *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition cursor-pointer">
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      className="hidden" 
                      id="comprobante" 
                    />
                    <label htmlFor="comprobante" className="cursor-pointer">
                      {comprobante ? (
                        <div className="text-teal-600">
                          <Check className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">✓ {comprobante.name}</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="w-10 h-10 mx-auto mb-2" />
                          <p className="font-medium text-teal-600">Seleccionar archivo</p>
                          <p className="text-xs mt-1">JPG, PNG o PDF (máx. 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  {comprobanteError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {comprobanteError}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                    <p>Asegúrate de que el comprobante sea legible y contenga todos los datos del pago</p>
                  </div>
                </div>

                <button 
                  onClick={handleUploadComprobante} 
                  disabled={!comprobante || isUploadingComprobante} 
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    comprobante && !isUploadingComprobante 
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUploadingComprobante ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Confirmar Pago'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-8 py-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-600">💳 Pago 100% seguro • Los datos están protegidos</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // Componente de progreso
  const ProgressSteps = () => {
    const steps = [
      { key: 'cliente', label: 'Cliente', icon: User },
      { key: 'evento', label: 'Evento', icon: Clock },
      { key: 'servicios', label: 'Servicios', icon: Sparkles },
      { key: 'resumen', label: 'Resumen', icon: CreditCard },
    ];

    return (
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
        {steps.map((stepItem, index) => {
          const StepIcon = stepItem.icon;
          const isActive = step === stepItem.key;
          const isCompleted = steps.findIndex(s => s.key === step) > index;
          
          return (
            <div key={stepItem.key} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-teal-500 text-white scale-110' 
                  : isCompleted 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <StepIcon className="w-4 h-4" />
              </div>
              <span className={`text-xs mt-2 font-medium ${
                isActive ? 'text-teal-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
              }`}>
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar contenido según el step
  const renderStepContent = () => {
    switch (step) {
      case 'cliente':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900">Información del Cliente</h3>
              <p className="text-gray-600">Ingresa tus datos personales</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error al procesar la reserva</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={() => handleBlur('nombre')}
                  onKeyDown={soloLetrasEvento}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Juan"
                  required
                />
                {errores.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
                )}
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
                  onBlur={() => handleBlur('apellidoPaterno')}
                  onKeyDown={soloLetrasEvento}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.apellidoPaterno ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Pérez"
                />
                {errores.apellidoPaterno && (
                  <p className="text-red-500 text-xs mt-1">{errores.apellidoPaterno}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  onBlur={() => handleBlur('apellidoMaterno')}
                  onKeyDown={soloLetrasEvento}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.apellidoMaterno ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: García"
                />
                {errores.apellidoMaterno && (
                  <p className="text-red-500 text-xs mt-1">{errores.apellidoMaterno}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={() => handleBlur('telefono')}
                  onKeyDown={(e) => {
                    soloNumerosEvento(e);
                    bloquearCaracteresEspecialesEvento(e);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="7XXXXXXX"
                  maxLength={8}
                  required
                />
                {errores.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
                )}
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
                  onBlur={() => handleBlur('carnet')}
                  onKeyDown={(e) => {
                    soloNumerosEvento(e);
                    bloquearCaracteresEspecialesEvento(e);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.carnet ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="XXXXXXXX"
                  maxLength={9}
                  required
                />
                {errores.carnet && (
                  <p className="text-red-500 text-xs mt-1">{errores.carnet}</p>
                )}
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
                  onBlur={() => handleBlur('email')}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                    errores.email && touched.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-cyan-500'
                  }`}
                  placeholder="juan@email.com"
                />
                {errores.email && (
                  <p className="text-red-500 text-xs mt-1">{errores.email}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'evento':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900">Detalles del Evento</h3>
              <p className="text-gray-600">Configura los detalles de tu evento</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Reserva *
                </label>
                <select
                  name="tipoReserva"
                  value={formData.tipoReserva}
                  onChange={handleChange}
                  onBlur={() => handleBlur('tipoReserva')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.tipoReserva ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                {errores.tipoReserva && (
                  <p className="text-red-500 text-xs mt-1">{errores.tipoReserva}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha del Evento *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMostrarCalendario(!mostrarCalendario)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-left flex items-center justify-between bg-white ${
                      errores.fechaEvento ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                  {errores.fechaEvento && (
                    <p className="text-red-500 text-xs mt-1">{errores.fechaEvento}</p>
                  )}

                  {mostrarCalendario && (
                    <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-full md:w-96">
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

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {diasSemana.map(dia => (
                          <div key={dia} className="text-center text-xs font-semibold text-gray-600 py-2">
                            {dia}
                          </div>
                        ))}
                      </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  onBlur={() => handleBlur('horaInicio')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.horaInicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errores.horaInicio && (
                  <p className="text-red-500 text-xs mt-1">{errores.horaInicio}</p>
                )}
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
                  onBlur={() => handleBlur('horaFin')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.horaFin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errores.horaFin && (
                  <p className="text-red-500 text-xs mt-1">{errores.horaFin}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de Personas *
                </label>
                <input
                  type="text"
                  name="cantidadPersonas"
                  value={formData.cantidadPersonas}
                  onChange={handleChange}
                  onBlur={() => handleBlur('cantidadPersonas')}
                  onKeyDown={(e) => {
                    if (
                      !/^[0-9]$/.test(e.key) &&
                      ![
                        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                        'ArrowLeft', 'ArrowRight', 'Home', 'End'
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^\d*$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errores.cantidadPersonas ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 50"
                  inputMode="numeric"
                  maxLength={3}
                  required
                />
                {errores.cantidadPersonas && (
                  <p className="text-red-500 text-xs mt-1">{errores.cantidadPersonas}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'servicios':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900">Servicios Adicionales</h3>
              <p className="text-gray-600">Selecciona los servicios que deseas incluir</p>
            </div>

            <div>
              {isLoadingServicios ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Cargando servicios...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {servicios.map((servicio) => (
                    <label key={servicio.id_servicios_adicionales} className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition hover:border-teal-200">
                      <input
                        type="checkbox"
                        checked={formData.serviciosAdicionales.includes(servicio.id_servicios_adicionales)}
                        onChange={() => handleCheckboxChange(servicio.id_servicios_adicionales)}
                        className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">{servicio.nombre}</span>
                        <p className="text-sm text-gray-500 mt-1">{servicio.descripcion}</p>
                        <p className="text-xs text-teal-600 font-medium mt-1">
                          {servicio.tipo === 'A' 
                            ? ` ${servicio.precio.toFixed(2)} Bs. por persona` 
                            : ` ${servicio.precio.toFixed(2)} Bs. (precio fijo)`}
                        </p>
                      </div>
                      <span className="text-teal-600 font-semibold text-lg">{servicio.precio.toFixed(2)} Bs.</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen de precios en tiempo real */}
            {serviciosSeleccionados.length > 0 && (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
                <h4 className="font-semibold text-teal-800 mb-2">Resumen Seleccionado:</h4>
                <div className="space-y-2">
                  {serviciosSeleccionados.map(servicio => (
                    <div key={servicio.id_servicios_adicionales} className="flex justify-between text-sm">
                      <span>{servicio.nombre}</span>
                      <span className="font-medium">
                        {servicio.tipo === 'A' && formData.cantidadPersonas
                          ? `${(servicio.precio * parseInt(formData.cantidadPersonas)).toFixed(2)} Bs.`
                          : `${servicio.precio.toFixed(2)} Bs.`
                        }
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-teal-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-teal-700">{precioTotal.toFixed(2)} Bs.</span>
                    </div>
                    <div className="flex justify-between text-sm text-amber-600">
                      <span>Adelanto (50%):</span>
                      <span>{precioAdelanto.toFixed(2)} Bs.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'resumen':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900">Resumen de Reserva</h3>
              <p className="text-gray-600">Revisa y confirma los detalles de tu reserva</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Información del Cliente */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Información del Cliente
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{formData.nombre} {formData.apellidoPaterno} {formData.apellidoMaterno}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{formData.telefono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CI:</span>
                    <span className="font-medium">{formData.carnet}</span>
                  </div>
                </div>
              </div>

              {/* Detalles del Evento */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Detalles del Evento
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium capitalize">{formData.tipoReserva}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">
                      {formData.fechaEvento 
                        ? new Date(formData.fechaEvento + 'T00:00:00').toLocaleDateString('es-ES')
                        : '-'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horario:</span>
                    <span className="font-medium">{formData.horaInicio} - {formData.horaFin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Personas:</span>
                    <span className="font-medium">{formData.cantidadPersonas}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Servicios Seleccionados */}
            <div className="bg-white rounded-2xl border-2 border-teal-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                <h3 className="text-lg font-bold text-white text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Resumen de Servicios y Pagos
                </h3>
              </div>
              
              {serviciosSeleccionados.length > 0 ? (
                <div className="p-6 space-y-4">
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
                          {servicio.tipo === 'E' && (
                            <p className="text-sm text-gray-500 mt-1">Precio fijo</p>
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
                  
                  <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-200">
                    <div className="flex justify-between items-center p-4 bg-teal-50 rounded-xl">
                      <span className="text-gray-700 font-semibold">Total de servicios:</span>
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
                  <p className="text-gray-500 mb-2">No se seleccionaron servicios adicionales</p>
                  <p className="text-sm text-gray-400">El costo total de tu reserva es</p>
                  <div className="mt-4 inline-block px-6 py-2 bg-gray-100 rounded-lg">
                    <p className="text-3xl font-bold text-gray-400">0.00 <span className="text-xl">Bs.</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[90vh] overflow-hidden">
      <div className="w-full bg-white rounded-2xl p-8 max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-teal-800">Reserva de Eventos</h2>
          <p className="text-gray-600 mt-2">Completa el formulario paso a paso</p>
        </div>

        {/* Barra de progreso */}
        <ProgressSteps />

        {/* Contenido del step actual */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={step === 'cliente' ? onClose : handleAnterior}
            disabled={isLoading}
          >
            {step === 'cliente' ? 'Cancelar' : 'Anterior'}
          </Button>
          
          <div className="flex gap-3">
            {step !== 'resumen' ? (
              <Button
                variant="primary"
                onClick={handleSiguiente}
                disabled={!validarStep(step) || isLoading}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleContinuarPago}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : `Continuar al Pago - ${precioAdelanto.toFixed(2)} Bs.`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}