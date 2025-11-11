import { useState, useEffect, useMemo } from 'react';
import { Sparkles, CheckCircle, X, AlertCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';
import { useUpdateEvento } from '../../../../hooks/AdReservas/Reserva_Eventos/useUpdateEventos';
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
  bloquearCaracteresEspecialesEvento
} from '../../../../components/utils/validaciones';

interface EventoModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reservaData: any;
}

// Función helper para convertir cualquier valor a string de forma segura
const safeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val.toString();
  return String(val);
};

export default function EventoModalEdit({ isOpen, onClose, onSuccess, reservaData }: EventoModalEditProps) {
  const { updateReservaEvento, isUpdating, error, resetState } = useUpdateEvento();
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
    hora_ini: '',
    hora_fin: '',
    serviciosAdicionales: [] as number[],
  });

  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<'form' | 'waiting' | 'success' | 'error'>('form');
  const [segundos, setSegundos] = useState(10);
  const [codigoReserva, setCodigoReserva] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [errorDetallado, setErrorDetallado] = useState('');

  // Cargar datos de la reserva cuando se abre el modal
  useEffect(() => {
    if (isOpen && reservaData) {
      console.log('📥 Datos COMPLETOS de reserva:', reservaData);

      // Extraer datos del cliente
      const datosCliente = reservaData.datos_cliente || {};

      // Extraer IDs de servicios adicionales - CORREGIDO
      let serviciosIds: number[] = [];
      if (reservaData.servicios_adicionales && Array.isArray(reservaData.servicios_adicionales)) {
        serviciosIds = reservaData.servicios_adicionales
          .map((s: any) => {
            // Si es un objeto, extraer el ID, si es número, usarlo directamente
            if (typeof s === 'object' && s !== null) {
              return s.id_servicios_adicionales || s.id || s.servicio_id;
            }
            return s;
          })
          .filter((id: any) => id !== null && id !== undefined && !isNaN(Number(id)))
          .map((id: any) => Number(id)); // Asegurar que sean números
      }

      console.log('🔄 IDs de servicios extraídos:', serviciosIds);

      // FUNCIÓN PARA EXTRAER SOLO LA HORA DE UN DATETIME
      const extraerHoraDeDateTime = (dateTimeString: string) => {
        if (!dateTimeString) return '';
        try {
          const date = new Date(dateTimeString);
          return date.toTimeString().slice(0, 5); // Formato "HH:MM"
        } catch (error) {
          console.error('Error al extraer hora:', error);
          return '';
        }
      };

      // Mapeo CORREGIDO para Django - asegurando que todos sean strings
      const datosMapeados = {
        // Datos personales - convertir explícitamente a string
        nombre: safeString(datosCliente.nombre || reservaData.nombre),
        apellidoPaterno: safeString(datosCliente.app_paterno || reservaData.app_paterno),
        apellidoMaterno: safeString(datosCliente.app_materno || reservaData.app_materno),
        telefono: safeString(datosCliente.telefono || reservaData.telefono),
        email: safeString(datosCliente.email || reservaData.email),
        carnet: safeString(datosCliente.ci || reservaData.ci || reservaData.carnet),

        // Datos de reserva
        fechaEvento: safeString(reservaData.fecha || reservaData.fecha_evento),
        cantidadPersonas: safeString(reservaData.cant_personas || reservaData.cantidad_personas),
        tipoReserva: safeString(reservaData.reservas_gen?.tipo_reserva || reservaData.tipo_reserva),

        // DateTimeFields - extraer solo la hora
        hora_ini: extraerHoraDeDateTime(reservaData.hora_ini),
        hora_fin: extraerHoraDeDateTime(reservaData.hora_fin),

        serviciosAdicionales: serviciosIds,
      };

      console.log('📋 Datos mapeados FINALES:', datosMapeados);
      console.log('🎯 Servicios cargados:', datosMapeados.serviciosAdicionales);

      setFormData(datosMapeados);

      // Establecer código de reserva
      if (reservaData.codigo_reserva) {
        setCodigoReserva(reservaData.codigo_reserva);
      } else if (reservaData.id_reservas_evento) {
        setCodigoReserva(`EVT${reservaData.id_reservas_evento.toString().padStart(4, '0')}`);
      }

      // Configurar calendario si hay fecha
      const fechaParaCalendario = reservaData.fecha || reservaData.hora_ini;
      if (fechaParaCalendario) {
        try {
          const fecha = new Date(fechaParaCalendario);
          if (!isNaN(fecha.getTime())) {
            setFechaSeleccionada(fecha);
            setMesActual(fecha);
          }
        } catch (error) {
          console.error('Error al parsear fecha:', error);
        }
      }
    }
  }, [isOpen, reservaData]);

  const validarCampo = (nombre: string, valor: any) => {
    const valorString = safeString(valor);

    let error: string | null = null;

    switch (nombre) {
      case 'nombre':
        error = validarNombreEvento(valorString);
        break;
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        const apellidoPaterno = nombre === 'apellidoPaterno' ? valorString : safeString(formData.apellidoPaterno);
        const apellidoMaterno = nombre === 'apellidoMaterno' ? valorString : safeString(formData.apellidoMaterno);
        const erroresApellidos = validarApellidosEvento(apellidoPaterno, apellidoMaterno);
        error = nombre === 'apellidoPaterno' ? erroresApellidos.paterno : erroresApellidos.materno;
        break;
      case 'telefono':
        error = validarTelefonoEvento(valorString);
        break;
      case 'email':
        error = validarEmailEvento(valorString);
        break;
      case 'carnet':
        error = validarCIEvento(valorString);
        break;
      case 'fechaEvento':
        error = validarFechaEvento(valorString);
        break;
      case 'cantidadPersonas':
        error = validarCantidadPersonasEvento(valorString);
        break;
      case 'tipoReserva':
        error = valorString ? null : "Debe seleccionar un tipo de evento";
        break;
      case 'hora_ini':
        error = validarHoraInicio(valorString);
        break;
      case 'hora_fin':
        const horaInicio = safeString(formData.hora_ini);
        const fechaEvento = safeString(formData.fechaEvento);
        error = validarHoraFin(horaInicio, valorString, fechaEvento);
        break;
      default:
        error = null;
    }

    return error;
  };

  // Actualizar errores cuando cambia formData
  useEffect(() => {
    const nuevosErrores: Record<string, string | null> = {};

    // Lista explícita de campos para evitar problemas de tipo
    const campos = [
      'nombre', 'apellidoPaterno', 'apellidoMaterno',
      'telefono', 'email', 'carnet', 'fechaEvento',
      'cantidadPersonas', 'tipoReserva', 'hora_ini', 'hora_fin'
    ] as const;

    campos.forEach(field => {
      if (touched[field]) {
        const valor = formData[field];
        nuevosErrores[field] = validarCampo(field, valor);
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

    console.log('💰 Servicios seleccionados para cálculo:', serviciosSeleccionados);
    console.log('👥 Cantidad de personas:', formData.cantidadPersonas);

    serviciosSeleccionados.forEach(servicio => {
      if (servicio.tipo === 'A') {
        const cantidadPersonas = parseInt(formData.cantidadPersonas) || 1;
        const subtotal = servicio.precio * cantidadPersonas;
        total += subtotal;
        console.log(`📊 ${servicio.nombre}: ${servicio.precio} × ${cantidadPersonas} = ${subtotal}`);
      } else {
        total += servicio.precio;
        console.log(`📊 ${servicio.nombre}: ${servicio.precio} (precio fijo)`);
      }
    });

    console.log('💰 Total calculado:', total);
    return total;
  }, [formData.serviciosAdicionales, formData.cantidadPersonas, servicios]);

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
      setStep('form');
    }
  }, [step, segundos]);

  const handleBlur = (field: string) => {
    let valorLimpio = safeString(formData[field as keyof typeof formData]);

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

  const handleActualizarReserva = async (e: React.FormEvent) => {
    e.preventDefault();

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
      hora_ini: true,
      hora_fin: true,
    };
    setTouched(todosLosCampos);

    // Crear objeto temporal CONVIRTIENDO TODOS LOS CAMPOS A STRING
    const datosParaValidar = {
      nombre: safeString(formData.nombre),
      apellidoPaterno: safeString(formData.apellidoPaterno),
      apellidoMaterno: safeString(formData.apellidoMaterno),
      telefono: safeString(formData.telefono),
      email: safeString(formData.email),
      carnet: safeString(formData.carnet),
      fechaEvento: safeString(formData.fechaEvento),
      cantidadPersonas: safeString(formData.cantidadPersonas),
      tipoReserva: safeString(formData.tipoReserva),
      horaInicio: safeString(formData.hora_ini),
      horaFin: safeString(formData.hora_fin),
    };

    console.log('🔍 Datos para validación:', datosParaValidar);

    const erroresValidacion = validarFormularioEvento(datosParaValidar);

    // Mapear los errores de vuelta a los nombres del formData
    const erroresMapeados: Record<string, string | null> = {
      ...erroresValidacion,
      hora_ini: (erroresValidacion as any).horaInicio,
      hora_fin: (erroresValidacion as any).horaFin
    };

    setErrores(erroresMapeados);

    const hayErrores = Object.values(erroresMapeados).some(error => error !== null);

    if (hayErrores) {
      const primerCampoConError = Object.keys(erroresMapeados).find(key => erroresMapeados[key]);
      if (primerCampoConError) {
        const elemento = document.querySelector(`[name="${primerCampoConError}"]`) as HTMLElement;
        if (elemento) elemento.focus();
      }
      return;
    }

    setStep('waiting');
    setSegundos(10);

    try {
      // RECONSTRUIR DATETIME PARA DJANGO
      const reconstruirDateTime = (fecha: string, hora: string) => {
        if (!fecha || !hora) return '';
        return `${fecha}T${hora}:00`; // Formato: "YYYY-MM-DDTHH:MM:00"
      };

      // CORREGIDO: Enviar TODOS los datos del cliente y de la reserva
      const datosActualizados = {
        // === DATOS DEL CLIENTE ===
        nombre: formData.nombre,
        app_paterno: formData.apellidoPaterno,
        app_materno: formData.apellidoMaterno,
        telefono: Number(formData.telefono),
        email: formData.email,
        ci: Number(formData.carnet),

        // === DATOS DE LA RESERVA ===
        fecha: formData.fechaEvento,
        cant_personas: parseInt(formData.cantidadPersonas),
        hora_ini: reconstruirDateTime(formData.fechaEvento, formData.hora_ini),
        hora_fin: reconstruirDateTime(formData.fechaEvento, formData.hora_fin),
        servicios_adicionales: formData.serviciosAdicionales,
        tipo_reserva: formData.tipoReserva,

        // === DATOS ADICIONALES PARA ACTUALIZACIÓN ===
        datos_cliente_id: reservaData.datos_cliente?.id_datos_cliente, // Si necesitas el ID del cliente
        reservas_gen_id: reservaData.reservas_gen?.id_reservas_gen // Si necesitas el ID de reservas_gen
      };

      console.log('📤 Datos COMPLETOS para enviar a Django:', datosActualizados);
      console.log('🎯 Servicios a enviar:', datosActualizados.servicios_adicionales);

      const reservaId = reservaData.id_reservas_evento;

      if (!reservaId) {
        throw new Error('No se pudo identificar el ID de la reserva');
      }

      console.log('🔄 Llamando a updateReservaEvento con ID:', reservaId);

      const result = await updateReservaEvento(reservaId, datosActualizados);

      console.log('✅ Resultado de updateReservaEvento:', result);

      if (result) {
        setStep('success');
        // Cerrar automáticamente después de 2 segundos
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          onClose(); // Cerrar el modal
        }, 2000);
      } else {
        throw new Error('No se pudo actualizar la reserva - respuesta vacía');
      }
    } catch (err) {
      console.error('❌ Error en la actualización:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al actualizar la reserva';
      setErrorDetallado(errorMsg);
      setStep('error');
    }
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
      hora_ini: '',
      hora_fin: '',
      serviciosAdicionales: [],
    });
    setErrores({});
    setTouched({});
    setStep('form');
    setCodigoReserva('');
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

          <h2 className="text-3xl font-bold text-red-800 mb-2">No se pudo actualizar tu reserva</h2>
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

  if (step === 'waiting') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="w-full bg-white rounded-2xl p-12 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-teal-800 mb-3">Actualizando tu Reserva</h2>
          <p className="text-gray-600 mb-4">
            Por favor espera mientras procesamos los cambios en tu reserva.
          </p>

          <div className="text-5xl font-bold text-teal-600">{segundos}s</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="w-full bg-white rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-teal-800">Editar Reserva de Eventos</h2>
          <p className="text-gray-600 mt-2">Modifica los datos de tu reserva</p>
          {codigoReserva && (
            <div className="mt-2 bg-teal-100 inline-flex items-center gap-2 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-teal-800">Código: {codigoReserva}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error al actualizar la reserva</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleActualizarReserva} className="space-y-6">
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
                  onBlur={() => handleBlur('nombre')}
                  onKeyDown={soloLetrasEvento}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: Juan"
                  required
                />
                {errores.nombre && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.nombre}
                  </p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.apellidoPaterno ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: Pérez"
                />
                {errores.apellidoPaterno && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.apellidoPaterno}
                  </p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.apellidoMaterno ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: García"
                />
                {errores.apellidoMaterno && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.apellidoMaterno}
                  </p>
                )}
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
                  onBlur={() => handleBlur('telefono')}
                  onKeyDown={(e) => {
                    soloNumerosEvento(e);
                    bloquearCaracteresEspecialesEvento(e);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="7XXXXXXX"
                  maxLength={8}
                  required
                />
                {errores.telefono && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.telefono}
                  </p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.carnet ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-100 cursor-not-allowed`}
                  placeholder="XXXXXXXX"
                  maxLength={9}
                  required
                  readOnly // Esto bloquea el campo para edición
                  title="El carnet de identidad no se puede modificar"
                />
                {errores.carnet && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.carnet}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">El carnet de identidad no se puede modificar</p>
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
                onBlur={() => handleBlur('email')}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${errores.email && touched.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-cyan-500'
                  }`}
                placeholder="juan@email.com"
              />
              {errores.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errores.email}
                </p>
              )}
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
                onBlur={() => handleBlur('tipoReserva')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.tipoReserva ? 'border-red-500' : 'border-gray-300'
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
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errores.tipoReserva}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Evento *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMostrarCalendario(!mostrarCalendario)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-left flex items-center justify-between bg-white transition ${errores.fechaEvento ? 'border-red-500' : 'border-gray-300'
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
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.fechaEvento}
                  </p>
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
                              className={`w-full h-full rounded-lg text-sm font-medium transition-all ${esFechaPasada(dia)
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="hora_ini"
                  value={formData.hora_ini}
                  onChange={handleChange}
                  onBlur={() => handleBlur('hora_ini')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.hora_ini ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                />
                {errores.hora_ini && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.hora_ini}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin *
                </label>
                <input
                  type="time"
                  name="hora_fin"
                  value={formData.hora_fin}
                  onChange={handleChange}
                  onBlur={() => handleBlur('hora_fin')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.hora_fin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                />
                {errores.hora_fin && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.hora_fin}
                  </p>
                )}
              </div>
            </div>

            <div>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errores.cantidadPersonas ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Ej: 50"
                inputMode="numeric"
                maxLength={3}
                required
              />
              {errores.cantidadPersonas && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errores.cantidadPersonas}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios Adicionales
              </label>
              {isLoadingServicios ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                  <span className="ml-2 text-gray-500">Cargando servicios...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
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

          {/* Resumen de precios */}
          <div className="bg-white rounded-2xl border-2 border-teal-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Resumen de tu Reserva
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
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No hay servicios adicionales seleccionados</p>
                <div className="mt-4 inline-block px-6 py-2 bg-gray-100 rounded-lg">
                  <p className="text-3xl font-bold text-gray-400">0.00 <span className="text-xl">Bs.</span></p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar Reserva'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}