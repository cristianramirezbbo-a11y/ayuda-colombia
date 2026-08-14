"use client";

import { useState } from "react";
import { crearAcopioAction } from "@/app/acopios/actions";
import {
  IconMapPin,
  IconCheck,
  IconAlert,
  IconSend,
  IconKey,
} from "./icons";

type EstadoUbicacion =
  | { estado: "vacio" }
  | { estado: "buscando" }
  | { estado: "lista"; lat: number; lon: number; precision: number }
  | { estado: "error"; mensaje: string };

export default function NuevoAcopioForm() {
  const [ubicacion, setUbicacion] = useState<EstadoUbicacion>({ estado: "vacio" });

  function usarMiUbicacion() {
    if (!("geolocation" in navigator)) {
      setUbicacion({
        estado: "error",
        mensaje: "Tu navegador no soporta geolocalización.",
      });
      return;
    }
    setUbicacion({ estado: "buscando" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({
          estado: "lista",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          precision: Math.round(pos.coords.accuracy),
        });
      },
      () => {
        setUbicacion({
          estado: "error",
          mensaje:
            "No se pudo obtener tu ubicación. Puedes describirla en el campo de texto.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <form
      action={crearAcopioAction}
      className="card space-y-5 p-4 sm:p-6"
    >
      <div>
        <label htmlFor="nombre" className="label">
          Nombre del punto de acopio
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          maxLength={120}
          placeholder="Ej. Polideportivo de Ciudad Bolívar"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="recibe" className="label">
          ¿Qué recibe? (opcional)
        </label>
        <input
          id="recibe"
          name="recibe"
          maxLength={200}
          placeholder="Ej. Agua, alimentos no perecederos, ropa de abrigo"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="horario" className="label">
          Horario (opcional)
        </label>
        <input
          id="horario"
          name="horario"
          maxLength={100}
          placeholder="Ej. Todos los días, 8am - 6pm"
          className="input"
        />
      </div>

      <div>
        <label className="label">Ubicación</label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={usarMiUbicacion}
            className="btn-secondary"
          >
            <IconMapPin className="h-4 w-4" />
            Usar mi ubicación actual
          </button>
          {ubicacion.estado === "buscando" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />
              Buscando ubicación…
            </span>
          )}
          {ubicacion.estado === "lista" && (
            <span className="chip bg-emerald-50 text-emerald-700">
              <IconCheck className="h-3.5 w-3.5" />
              Ubicación capturada (~{ubicacion.precision} m)
            </span>
          )}
          {ubicacion.estado === "error" && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600">
              <IconAlert className="h-3.5 w-3.5 shrink-0" />
              {ubicacion.mensaje}
            </span>
          )}
        </div>
        <input
          type="hidden"
          name="lat"
          value={ubicacion.estado === "lista" ? ubicacion.lat : ""}
        />
        <input
          type="hidden"
          name="lon"
          value={ubicacion.estado === "lista" ? ubicacion.lon : ""}
        />
        <input
          name="locationLabel"
          required
          maxLength={100}
          placeholder="Dirección (ej. Calle 80 #45-12, Bogotá) — se ubica en el mapa automáticamente"
          className="input mt-2"
        />
      </div>

      <div>
        <label htmlFor="contacto" className="label">
          Contacto (opcional)
        </label>
        <input
          id="contacto"
          name="contact"
          maxLength={80}
          placeholder="Cómo te pueden contactar (teléfono, nombre...)"
          className="input"
        />
      </div>

      <div className="alert-warn flex items-start gap-3">
        <IconKey className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Al crearlo recibirás un <strong>código de gestión</strong> para
          actualizar el estado después (abierto, necesita más, lleno, cerrado).
          Guárdalo — no hay forma de recuperarlo si lo pierdes.
        </span>
      </div>

      <button type="submit" className="btn-primary w-full !py-2.5">
        <IconSend className="h-4 w-4" />
        Registrar acopio
      </button>
    </form>
  );
}
