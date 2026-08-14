"use client";

import { useState } from "react";
import { CATEGORIA_INFO, type CategoriaReporte } from "@/lib/reportes-types";
import { crearReporteAction } from "@/app/reportes/actions";
import {
  IconMapPin,
  IconCheck,
  IconAlert,
  IconSend,
} from "./icons";

const CATEGORIAS: CategoriaReporte[] = [
  "necesito_ayuda",
  "necesito_algo",
  "ayuda_llegada",
  "desaparecido",
];

type EstadoUbicacion =
  | { estado: "vacio" }
  | { estado: "buscando" }
  | { estado: "lista"; lat: number; lon: number; precision: number }
  | { estado: "error"; mensaje: string };

export default function NuevoReporteForm() {
  const [categoria, setCategoria] = useState<CategoriaReporte>("necesito_ayuda");
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

  const info = CATEGORIA_INFO[categoria];

  return (
    <form
      action={crearReporteAction}
      className="card space-y-5 p-4 sm:p-6"
    >
      <div>
        <label className="label">¿Qué tipo de reporte es?</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIAS.map((cat) => {
            const c = CATEGORIA_INFO[cat];
            const activo = categoria === cat;
            return (
              <label
                key={cat}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                  activo
                    ? "text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                }`}
                style={
                  activo ? { backgroundColor: c.color, borderColor: c.color } : undefined
                }
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={activo}
                  onChange={() => setCategoria(cat)}
                  className="sr-only"
                  required
                />
                {c.label}
                {activo && <IconCheck className="h-4 w-4 shrink-0" />}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="titulo" className="label">
          {categoria === "desaparecido" ? "Nombre de la persona" : "¿Qué está pasando?"}
        </label>
        <input
          id="titulo"
          name="title"
          required
          maxLength={120}
          placeholder={info.placeholder}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="detalles" className="label">
          Detalles (opcional)
        </label>
        <textarea
          id="detalles"
          name="description"
          maxLength={500}
          rows={3}
          placeholder={
            categoria === "desaparecido"
              ? "Última vez que se le vio, señas particulares..."
              : "Cualquier detalle que ayude a otros a actuar"
          }
          className="input resize-y"
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
          maxLength={100}
          placeholder="O escribe la dirección (ej. Calle 80 #45-12, Bogotá) — también se ubica en el mapa"
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
        <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Este reporte será <strong>público</strong>: cualquiera podrá verlo.
          No incluyas datos sensibles de otras personas sin su consentimiento.
          Si es riesgo de vida inmediato, llama al <strong>123</strong>.
        </span>
      </div>

      <button type="submit" className="btn-primary w-full !py-2.5">
        <IconSend className="h-4 w-4" />
        Publicar reporte
      </button>
    </form>
  );
}
