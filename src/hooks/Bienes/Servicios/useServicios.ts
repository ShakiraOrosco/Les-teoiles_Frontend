import { useState, useEffect } from "react";
import { ServicioAdicional } from "../../../types/Bienes/Servicios/servicio";
import * as servicioService from "../../../services/Bienes/Servicios/serviciosServices";

export const useServicios = () => {
  const [servicios, setServicios] = useState<ServicioAdicional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Función para recargar los servicios
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicioService.getServicios();
      setServicios(data);
    } catch {
      setError("Error al cargar los servicios adicionales");
      setServicios([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Cargar automáticamente al montar el componente
  useEffect(() => {
    refetch();
  }, []);

  return { servicios, loading, error, refetch };
};