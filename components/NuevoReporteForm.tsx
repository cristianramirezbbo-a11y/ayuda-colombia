"use client";

import { useState } from "react";
import { CATEGORIA_INFO, type CategoriaReporte } from "@/lib/reportes-types";
import { crearReporteAction } from "@/app/reportes/actions";

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
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
    >
      <div>
        <label className="mb-2 block text-xs font-medium text-slate-600">
          ¿Qué tipo de reporte es?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIAS.map((cat) => {
            const c = CATEGORIA_INFO[cat];
            const activo = categoria === cat;
            return (
              <label
                key={cat}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium ${
                  activo ? "text-white" : "border-slate-300 text-slate-700"
                }`}
                style={activo ? { backgroundColor: c.color, borderColor: c.color } : undefined}
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
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          {categoria === "desaparecido" ? "Nombre de la persona" : "¿Qué está pasando?"}
        </label>
        <input
          name="title"
          required
          maxLength={120}
          placeholder={info.placeholder}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Detalles (opcional)
        </label>
        <textarea
          name="description"
          maxLength={500}
          rows={3}
          placeholder={
            categoria === "desaparecido"
              ? "Última vez que se le vio, señas particulares..."
              : "Cualquier detalle que ayude a otros a actuar"
          }
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
          maxLength={100}
          placeholder="O describe el lugar (ej. Barrio, ciudad)"
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
        Este reporte será <strong>público</strong>: cualquiera podrá verlo. No
        incluyas datos sensibles de otras personas sin su consentimiento. Si
        es riesgo de vida inmediato, llama al <strong>123</strong>.
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Publicar reporte
      </button>
    </form>
  );
}
