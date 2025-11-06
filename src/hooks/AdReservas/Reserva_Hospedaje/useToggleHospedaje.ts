// src/hooks/AdReservas/Reserva_Hospedaje/useToggleHospedaje.ts
import { useState } from "react";
import * as reservaHotelService from "../../../services/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje_Services";
import { toast } from "sonner";

export function useCancelHospedaje() {
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelReservaHotel = async (idReserva: number): Promise<boolean> => {
    setIsCanceling(true);
    setError(null);

    try {
      await reservaHotelService.deleteReservaHotel(idReserva);
      toast.success("Reserva cancelada exitosamente");
      return true;
    } catch (err: any) {
      const backendError = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Error al cancelar la reserva";

      // Manejar errores específicos
      if (backendError.includes("No se puede cancelar una reserva")) {
        toast.error("No se puede cancelar una reserva en estado finalizado");
      } else if (backendError.includes("Ya está cancelada")) {
        toast.error("La reserva ya se encuentra cancelada");
      } else {
        toast.error(backendError);
      }

      setError(backendError);
      return false;
    } finally {
      setIsCanceling(false);
    }
  };

  return {
    cancelReservaHotel,
    isCanceling,
    error,
  };
}