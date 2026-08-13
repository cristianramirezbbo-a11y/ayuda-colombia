import Link from "next/link";
import type { Sismo } from "@/lib/sgc";
import { calcularRiesgo, NIVEL_RIESGO_INFO } from "@/lib/riesgo";

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
  const ordenados = [...sismos].sort((a, b) => b.utcTime.localeCompare(a.utcTime));

  if (sismos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        Sin datos disponibles en este momento.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {ordenados.map((s) => {
        const riesgo = calcularRiesgo(s);
        const infoRiesgo = NIVEL_RIESGO_INFO[riesgo.nivel];
        return (
          <li key={s.id}>
            <Link
              href={`/sismos/${encodeURIComponent(s.id)}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50"
            >
              <span
                className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${badgeColor(s)}`}
              >
                M{s.mag.toFixed(1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {s.place}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {s.localTime} · Prof. {s.depth.toFixed(1)} km ·{" "}
                  {s.felt > 0 ? `${s.felt} reportes de percepción` : "No reportado como sentido"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white ${infoRiesgo.color}`}
              >
                {infoRiesgo.label}
              </span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {estadoLabel(s)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
