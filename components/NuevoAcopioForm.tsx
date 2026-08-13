"use client";

import { useState } from "react";
import { crearAcopioAction } from "@/app/acopios/actions";

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
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Nombre del punto de acopio
        </label>
        <input
          name="nombre"
          required
          maxLength={120}
          placeholder="Ej. Polideportivo de Ciudad Bolívar"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          ¿Qué recibe? (opcional)
        </label>
        <input
          name="recibe"
          maxLength={200}
          placeholder="Ej. Agua, alimentos no perecederos, ropa de abrigo"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Horario (opcional)
        </label>
        <input
          name="horario"
          maxLength={100}
          placeholder="Ej. Todos los días, 8am - 6pm"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Ubicación
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={usarMiUbicacion}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
          >
            Usar mi ubicación actual
          </button>
          {ubicacion.estado === "buscando" && (
            <span className="text-xs text-slate-500">Buscando ubicación…</span>
          )}
          {ubicacion.estado === "lista" && (
            <span className="text-xs text-emerald-700">
              Ubicación capturada (precisión ~{ubicacion.precision} m)
            </span>
          )}
          {ubicacion.estado === "error" && (
            <span className="text-xs text-red-600">{ubicacion.mensaje}</span>
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
          placeholder="Dirección o punto de referencia (ej. Calle 80 #45-12, Bogotá)"
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Contacto (opcional)
        </label>
        <input
          name="contact"
          maxLength={80}
          placeholder="Cómo te pueden contactar (teléfono, nombre...)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
        Al crearlo recibirás un <strong>código de gestión</strong> para
        actualizar el estado después (abierto, necesita más, lleno, cerrado).
        Guárdalo — no hay forma de recuperarlo si lo pierdes.
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Registrar acopio
      </button>
    </form>
  );
}
