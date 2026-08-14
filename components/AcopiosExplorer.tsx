"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AcopioMap from "@/components/AcopioMap";
import { ESTADO_ACOPIO_INFO, type Acopio } from "@/lib/acopios-types";
import { distanciaKm, formatoDistancia } from "@/lib/geo";

type EstadoUbicacion =
  | { estado: "vacio" }
  | { estado: "buscando" }
  | { estado: "lista"; lat: number; lon: number }
  | { estado: "error"; mensaje: string };

export default function AcopiosExplorer({ acopios }: { acopios: Acopio[] }) {
  const [ubicacion, setUbicacion] = useState<EstadoUbicacion>({ estado: "vacio" });

  function mostrarCercanos() {
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
        });
      },
      () => {
        setUbicacion({
          estado: "error",
          mensaje: "No se pudo obtener tu ubicación.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const userLocation = ubicacion.estado === "lista" ? ubicacion : null;

  const acopiosConDistancia = useMemo(() => {
    if (!userLocation) return acopios.map((a) => ({ acopio: a, distanciaKm: null as number | null }));

    return acopios
      .map((a) => ({
        acopio: a,
        distanciaKm:
          a.lat != null && a.lon != null
            ? distanciaKm(userLocation.lat, userLocation.lon, a.lat, a.lon)
            : null,
      }))
      .sort((x, y) => {
        if (x.distanciaKm == null) return 1;
        if (y.distanciaKm == null) return -1;
        return x.distanciaKm - y.distanciaKm;
      });
  }, [acopios, userLocation]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={mostrarCercanos}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Mostrar los más cercanos a mí
        </button>
        {ubicacion.estado === "buscando" && (
          <span className="text-xs text-slate-500">Buscando tu ubicación…</span>
        )}
        {ubicacion.estado === "error" && (
          <span className="text-xs text-red-600">{ubicacion.mensaje}</span>
        )}
        {ubicacion.estado === "lista" && (
          <span className="text-xs text-emerald-700">
            Ordenado por cercanía a tu ubicación
          </span>
        )}
      </div>

      <AcopioMap acopios={acopios} userLocation={userLocation} />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          {acopios.length === 0
            ? "Aún no hay acopios registrados"
            : `${acopios.length} punto${acopios.length === 1 ? "" : "s"} de acopio`}
        </h2>

        {acopios.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Registra el primero si conoces uno activo.
          </div>
        ) : (
          <ul className="space-y-2">
            {acopiosConDistancia.map(({ acopio: a, distanciaKm: dist }) => {
              const info = ESTADO_ACOPIO_INFO[a.status];
              return (
                <li key={a.id}>
                  <Link
                    href={`/acopios/${a.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span
                            className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
                            style={{ backgroundColor: info.color }}
                          >
                            {info.label}
                          </span>
                          {dist != null && (
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                              {formatoDistancia(dist)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-800">
                          {a.nombre}
                        </p>
                        {a.recibe && (
                          <p className="mt-1 text-sm text-slate-600">
                            Recibe: {a.recibe}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                          {a.locationLabel}
                          {a.horario ? ` · ${a.horario}` : ""}
                          {a.contact ? ` · Contacto: ${a.contact}` : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
