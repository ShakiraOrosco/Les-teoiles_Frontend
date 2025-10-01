import { useEffect, useRef } from 'react';

interface MapboxMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export default function MapboxMap({ 
  latitude = -14.29522,  // Coordenadas por defecto de Reyes
  longitude = -67.33586,
  address = "SN 73031166, Reyes, Beni, Bolivia"
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Token de Mapbox (IMPORTANTE: Usa un token público pk. en producción)
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHVsY2VtYXJpYTIwIiwiYSI6ImNsdXJpMG5vbzA3ZXQyam9hcGgycGlhamsifQ.EFzhYybWxjdtnD0bHohnbw';

    // Cargar Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    script.onload = () => {
      if (mapContainerRef.current && !mapRef.current) {
        // @ts-ignore
        const mapboxgl = window.mapboxgl;
        mapboxgl.accessToken = MAPBOX_TOKEN;

        // Crear el mapa
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude],
          zoom: 15
        });

        // Agregar controles de navegación
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Control de pantalla completa
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        // Crear un elemento HTML personalizado para el marcador
        const markerElement = document.createElement('div');
        markerElement.style.width = '50px';
        markerElement.style.height = '50px';
        markerElement.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMGY3NjZlIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTIxIDEwYzAgNy05IDEzLTkgMTNzLTktNi05LTEzYTkgOSAwIDAgMSAxOCAweiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIGZpbGw9IndoaXRlIj48L2NpcmNsZT48L3N2Zz4=)';
        markerElement.style.backgroundSize = 'cover';
        markerElement.style.cursor = 'pointer';
        markerElement.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';

        // Crear popup con diseño mejorado
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: false,
          className: 'custom-popup'
        }).setHTML(
          `<div style="padding: 15px; min-width: 250px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <span style="font-size: 20px;">🏊</span>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #0f766e;">
                  Piscina Playa Azul
                </h3>
              </div>
            </div>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #374151; line-height: 1.5;">
              📍 ${address}
            </p>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" 
                target="_blank"
                rel="noopener noreferrer"
                style="display: inline-flex; align-items: center; padding: 8px 16px; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: transform 0.2s;"
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                🗺️ Cómo llegar
              </a>
            </div>
          </div>`
        );

        // Agregar marcador con popup
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map);

        // Mostrar popup automáticamente
        setTimeout(() => {
          marker.togglePopup();
        }, 500);

        // Agregar animación al marcador
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.1)';
          markerElement.style.transition = 'transform 0.2s';
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        mapRef.current = map;
      }
    };

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, address]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mr-3">
          <span className="text-2xl">📍</span>
        </div>
        <h3 className="text-2xl font-bold text-teal-800">Encuéntranos</h3>
      </div>
      
      <div 
        ref={mapContainerRef} 
        className="relative w-full rounded-lg overflow-hidden shadow-md border-2 border-teal-100"
        style={{ height: '450px' }}
      />
      
      <div className="mt-6 space-y-4">
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 text-center font-medium">
            📍 {address}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
          >
            🗺️ Obtener Direcciones
          </a>
          
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-teal-600 border-2 border-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition"
          >
            🔍 Ver en Google Maps
          </a>
        </div>
      </div>

      <style>{`
        .custom-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
      `}</style>
    </div>
  );
}