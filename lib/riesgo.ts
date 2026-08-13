import type { Sismo } from "./sgc";

export type NivelRiesgo = "bajo" | "moderado" | "alto" | "muy_alto";

export interface Riesgo {
  score: number; // 0-100
  nivel: NivelRiesgo;
  distanciaKm: number | null;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Extrae la distancia (km) al poblado más cercano desde `closerTowns`. */
function distanciaMinKm(closerTowns: string): number | null {
  const distancias = [...closerTowns.matchAll(/a\s+([\d.]+)\s*km/gi)].map((m) =>
    Number(m[1]),
  );
  if (distancias.length === 0) return null;
  return Math.min(...distancias);
}

/**
 * Índice de riesgo estimado (0-100), NO oficial. Es una heurística simple y
 * transparente para ordenar/priorizar sismos recientes, no una medición de
 * intensidad sísmica real (para eso existe el MMI, que ya se muestra aparte
 * cuando el SGC lo publica). Combina tres factores documentados:
 *
 *  - Magnitud (0-60 pts): escala linealmente entre M3.0 (0 pts) y M7.0 (60 pts).
 *  - Profundidad (0-20 pts): los sismos superficiales sacuden más la
 *    superficie por unidad de magnitud. 20 pts a ≤10 km, 0 pts a ≥100 km.
 *  - Cercanía a un poblado (0-20 pts): 20 pts a ≤5 km del poblado más
 *    cercano reportado por el SGC, 0 pts a ≥50 km. Si el SGC no reporta
 *    poblados cercanos, se asigna un valor medio (10 pts) por defecto.
 */
export function calcularRiesgo(sismo: Sismo): Riesgo {
  const puntosMagnitud = clamp(((sismo.mag - 3) / 4) * 60, 0, 60);
  const puntosProfundidad = clamp(((100 - sismo.depth) / 90) * 20, 0, 20);

  const distanciaKm = distanciaMinKm(sismo.closerTowns);
  const puntosProximidad =
    distanciaKm == null ? 10 : clamp(((50 - distanciaKm) / 45) * 20, 0, 20);

  const score = Math.round(
    clamp(puntosMagnitud + puntosProfundidad + puntosProximidad, 0, 100),
  );

  let nivel: NivelRiesgo;
  if (score >= 75) nivel = "muy_alto";
  else if (score >= 50) nivel = "alto";
  else if (score >= 25) nivel = "moderado";
  else nivel = "bajo";

  return { score, nivel, distanciaKm };
}

export const NIVEL_RIESGO_INFO: Record<
  NivelRiesgo,
  { label: string; color: string }
> = {
  bajo: { label: "Riesgo bajo", color: "bg-slate-400" },
  moderado: { label: "Riesgo moderado", color: "bg-amber-500" },
  alto: { label: "Riesgo alto", color: "bg-orange-600" },
  muy_alto: { label: "Riesgo muy alto", color: "bg-red-700" },
};
