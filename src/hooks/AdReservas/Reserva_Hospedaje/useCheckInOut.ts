// src/hooks/AdReservas/Reserva_Hospedaje/useCheckInOut.ts
import { useState } from 'react';
import {
    realizarCheckIn,
    realizarCheckOut,
    cancelarCheckIn,
    getReservasPendientesCheckIn,
    getReservasPendientesCheckOut
} from '../../../services/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje_Services';

export const useCheckInOut = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const realizarCheckInAction = async (idReserva: number) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🔄 Iniciando ingreso para reserva:', idReserva);
            const response = await realizarCheckIn(idReserva);
            console.log('✅ Ingreso exitoso:', response);
            return response;
        } catch (err: any) {
            console.error('❌ Error en realizarCheckInAction:', err);
            const errorMessage = err.message || 'Error al realizar ingreso';
            setError(errorMessage);
            throw err; // Re-lanzar el error para que el componente lo maneje
        } finally {
            setIsLoading(false);
        }
    };

    const realizarCheckOutAction = async (idReserva: number) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🔄 Iniciando salida para reserva:', idReserva);
            const response = await realizarCheckOut(idReserva);
            console.log('✅ Salida exitosa:', response);
            return response;
        } catch (err: any) {
            console.error('❌ Error en realizarCheckOutAction:', err);
            const errorMessage = err.message || 'Error al realizar salida';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const cancelarCheckInAction = async (idReserva: number) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🔄 Cancelando ingreso para reserva:', idReserva);
            const response = await cancelarCheckIn(idReserva);
            console.log('✅ Ingreso cancelado:', response);
            return response;
        } catch (err: any) {
            console.error('❌ Error en cancelarCheckInAction:', err);
            const errorMessage = err.message || 'Error al cancelar ingreso';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerReservasPendientesCheckIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const reservas = await getReservasPendientesCheckIn();
            return reservas;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Error al obtener reservas pendientes de ingreso';
            setError(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerReservasPendientesCheckOut = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const reservas = await getReservasPendientesCheckOut();
            return reservas;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Error al obtener reservas pendientes de salida';
            setError(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        realizarCheckIn: realizarCheckInAction,
        realizarCheckOut: realizarCheckOutAction,
        cancelarCheckIn: cancelarCheckInAction,
        obtenerReservasPendientesCheckIn,
        obtenerReservasPendientesCheckOut,
        isLoading,
        error,
        clearError
    };
};