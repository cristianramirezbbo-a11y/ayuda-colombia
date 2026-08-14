"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AcopioMap from "@/components/AcopioMap";
import MapLegend from "@/components/MapLegend";
import {
  ESTADO_ACOPIO_INFO,
  ESTADOS_ACOPIO_VALIDOS,
  type Acopio,
} from "@/lib/acopios-types";
import { distanciaKm, formatoDistancia } from "@/lib/geo";
import {
  IconMapPin,
  IconCheck,
  IconAlert,
  IconBox,
  IconChevronRight,
} from "./icons";

type EstadoUbicacion =
  | { estado: "vacio" }
  | { estado: "buscando" }
  | { estado: "lista"; lat: number; lon: number }
  | { estado: "error"; mensaje: string };

const LEYENDA = ESTADOS_ACOPIO_VALIDOS.map((e) => ({
  color: ESTADO_ACOPIO_INFO[e].color,
  label: ESTADO_ACOPIO_INFO[e].label,
  shape: "square" as const,
}));

export default function AcopiosExplorer({
  acopios,
  dbError = false,
}: {
  acopios: Acopio[];
  dbError?: boolean;
}) {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={mostrarCercanos} className="btn-primary">
          <IconMapPin className="h-4 w-4" />
          Mostrar los más cercanos a mí
        </button>
        {ubicacion.estado === "buscando" && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />
            Buscando tu ubicación…
          </span>
        )}
        {ubicacion.estado === "error" && (
          <span className="inline-flex items-center gap-1 text-xs text-red-600">
            <IconAlert className="h-3.5 w-3.5 shrink-0" />
            {ubicacion.mensaje}
          </span>
        )}
        {ubicacion.estado === "lista" && (
          <span className="chip bg-emerald-50 text-emerald-700">
            <IconCheck className="h-3.5 w-3.5" />
            Ordenado por cercanía a tu ubicación
          </span>
        )}
      </div>

      <AcopioMap acopios={acopios} userLocation={userLocation} />
      <MapLegend items={LEYENDA} />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          {dbError
            ? "Puntos de acopio"
            : acopios.length === 0
              ? "Aún no hay acopios registrados"
              : `${acopios.length} punto${acopios.length === 1 ? "" : "s"} de acopio`}
        </h2>

        {dbError ? (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <IconAlert className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium text-slate-600">
              La lista de acopios no está disponible por ahora.
            </p>
            <p className="text-xs text-slate-400">
              Reintenta en un momento. Si es una emergencia, llama al 123.
            </p>
          </div>
        ) : acopios.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-400">
              <IconBox className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium text-slate-600">
              Aún no hay acopios registrados.
            </p>
            <p className="text-xs text-slate-400">
              Registra el primero si conoces uno activo.
            </p>
            <Link href="/acopios/nuevo" className="btn-secondary mt-2">
              Registrar acopio
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {acopiosConDistancia.map(({ acopio: a, distanciaKm: dist }) => {
              const info = ESTADO_ACOPIO_INFO[a.status];
              return (
                <li key={a.id}>
                  <Link
                    href={`/acopios/${a.id}`}
                    className="group card block p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
                            style={{ backgroundColor: info.color }}
                          >
                            <span
                              aria-hidden
                              className="h-2 w-2 rounded-[3px] bg-white/70"
                            />
                            {info.label}
                          </span>
                          {dist != null && (
                            <span className="chip bg-blue-50 text-blue-800">
                              <IconMapPin className="h-3 w-3" />
                              {formatoDistancia(dist)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-950">
                          {a.nombre}
                        </p>
                        {a.recibe && (
                          <p className="mt-1 text-sm text-slate-600">
                            Recibe: {a.recibe}
                          </p>
                        )}
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {a.locationLabel}
                          {a.horario ? ` · ${a.horario}` : ""}
                          {a.contact ? ` · Contacto: ${a.contact}` : ""}
                        </p>
                      </div>
                      <IconChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
