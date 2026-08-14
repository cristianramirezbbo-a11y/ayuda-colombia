"use client";

import { useState } from "react";
import Link from "next/link";
import type { Sismo } from "@/lib/sgc";
import { calcularRiesgo, NIVEL_RIESGO_INFO } from "@/lib/riesgo";
import { IconChevronRight, IconAlert, IconChevronDown } from "./icons";

const VISIBLES_INICIALES = 15;
const INCREMENTO = 15;

type Filtro = "todos" | "relevantes";

function badgeColor(s: Sismo): string {
  if (s.mag >= 6) return "bg-red-600";
  if (s.mag >= 5) return "bg-orange-600";
  if (s.mag >= 4) return "bg-amber-600";
  if (s.mag >= 3) return "bg-blue-600";
  return "bg-slate-400";
}

function estadoLabel(s: Sismo): string {
  return s.status === "manual" ? "Revisado" : "Automático";
}

export default function SismoLista({ sismos }: { sismos: Sismo[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [visibles, setVisibles] = useState(VISIBLES_INICIALES);

  const ordenados = [...sismos].sort((a, b) =>
    b.utcTime.localeCompare(a.utcTime),
  );
  const filtrados =
    filtro === "relevantes"
      ? ordenados.filter((s) => s.mag >= 3)
      : ordenados;

  const hayMas = filtrados.length > visibles;
  const mostrados = filtrados.slice(0, visibles);

  if (sismos.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <IconAlert className="h-6 w-6" />
        </span>
        <p className="text-sm font-medium text-slate-600">
          Sin datos disponibles en este momento.
        </p>
        <p className="text-xs text-slate-400">
          El SGC no ha reportado sismos en los últimos 5 días o la fuente no
          responde.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros por magnitud */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Ver:</span>
        <button
          onClick={() => {
            setFiltro("todos");
            setVisibles(VISIBLES_INICIALES);
          }}
          className={`chip cursor-pointer border transition-colors ${
            filtro === "todos"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          aria-pressed={filtro === "todos"}
        >
          Todos ({ordenados.length})
        </button>
        <button
          onClick={() => {
            setFiltro("relevantes");
            setVisibles(VISIBLES_INICIALES);
          }}
          className={`chip cursor-pointer border transition-colors ${
            filtro === "relevantes"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          aria-pressed={filtro === "relevantes"}
        >
          M ≥ 3 ({ordenados.filter((s) => s.mag >= 3).length})
        </button>
      </div>

      <ul className="card divide-y divide-slate-100 overflow-hidden">
        {mostrados.map((s) => {
          const riesgo = calcularRiesgo(s);
          const infoRiesgo = NIVEL_RIESGO_INFO[riesgo.nivel];
          return (
            <li key={s.id}>
              <Link
                href={`/sismos/${encodeURIComponent(s.id)}`}
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 sm:gap-4"
              >
                <span
                  className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${badgeColor(s)}`}
                >
                  M{s.mag.toFixed(1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800 group-hover:text-slate-950">
                    {s.place}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {s.localTime} · Prof. {s.depth.toFixed(1)} km ·{" "}
                    {s.felt > 0
                      ? `${s.felt} reportes de percepción`
                      : "No reportado como sentido"}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${infoRiesgo.color}`}
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-white/70"
                    />
                    {infoRiesgo.label}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    {estadoLabel(s)}
                  </span>
                </div>
                <IconChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
              </Link>
            </li>
          );
        })}
      </ul>

      {hayMas && (
        <button
          onClick={() => setVisibles((v) => v + INCREMENTO)}
          className="btn-secondary mt-3 w-full"
        >
          <IconChevronDown className="h-4 w-4" />
          Mostrar más ({filtrados.length - visibles} restantes)
        </button>
      )}
    </div>
  );
}
