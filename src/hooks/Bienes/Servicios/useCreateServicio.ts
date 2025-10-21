// src/hooks/Bienes/Servicios/useServiciosAdicionales.ts
import { useEffect, useState, useCallback } from "react";
import { ServicioDTO, ServicioAdicional } from "../../../types/Bienes/Servicios/servicio";
import { getServicios, createServicio as createServicioAPI } from "../../../services/Bienes/Servicios/serviciosServices";

export const useServiciosAdicionales = () => {
  const [servicios, setServicios] = useState<ServicioAdicional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Obtener servicios ===
  const fetchServicios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServicios(); // Llamada real a API o mock
      setServicios(data);
    } catch (err) {
      setError("Error al cargar servicios");
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  // === Crear servicio ===
  const addServicio = async (nuevo: ServicioDTO) => {
    // Verificar duplicado por nombre
    const existe = servicios.some(s => s.nombre.toLowerCase() === nuevo.nombre.toLowerCase());
    if (existe) throw new Error("Ya existe un servicio con ese nombre");

    try {
      const creado = await createServicioAPI(nuevo); // Llamada a la API
      setServicios(prev => [...prev, creado]);
      return creado;
    } catch (err: any) {
      throw err;
    }
  };

  return { servicios, loading, error, refetch: fetchServicios, addServicio };
};