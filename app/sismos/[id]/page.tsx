import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import SismoMap from "@/components/SismoMap";
import { fetchSismoPorId } from "@/lib/sgc";
import { calcularRiesgo, NIVEL_RIESGO_INFO } from "@/lib/riesgo";
import { explicarRiesgo } from "@/lib/ai";

export const dynamic = "force-dynamic";

function badgeColor(mag: number): string {
  if (mag >= 6) return "bg-red-600";
  if (mag >= 5) return "bg-orange-600";
  if (mag >= 4) return "bg-amber-600";
  if (mag >= 3) return "bg-blue-600";
  return "bg-slate-400";
}

export default async function SismoDetallePage(
  props: PageProps<"/sismos/[id]">,
) {
  const { id } = await props.params;

  let sismo;
  try {
    sismo = await fetchSismoPorId(id);
  } catch {
    sismo = null;
  }

  if (!sismo) {
    notFound();
  }

  const riesgo = calcularRiesgo(sismo);
  const infoRiesgo = NIVEL_RIESGO_INFO[riesgo.nivel];
  const explicacionIA = await explicarRiesgo({
    mag: sismo.mag,
    depth: sismo.depth,
    place: sismo.place,
    scoreRiesgo: riesgo.score,
    nivelRiesgo: infoRiesgo.label,
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-20 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white ${badgeColor(sismo.mag)}`}
            >
              M{sismo.mag.toFixed(1)}
            </span>
            <div>
              <h1 className="text-xl font-bold">{sismo.place}</h1>
              <p className="text-sm text-slate-300">
                Detectado hace unos minutos por el SGC — no es una predicción.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <SismoMap sismos={[sismo]} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Magnitud</p>
            <p className="text-lg font-semibold text-slate-800">
              {sismo.mag.toFixed(1)} {sismo.magType}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Profundidad</p>
            <p className="text-lg font-semibold text-slate-800">
              {sismo.depth.toFixed(1)} km
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Hora local</p>
            <p className="text-lg font-semibold text-slate-800">
              {sismo.localTime}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Estado</p>
            <p className="text-lg font-semibold text-slate-800">
              {sismo.status === "manual" ? "Revisado" : "Automático"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Índice de riesgo estimado
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold text-white ${infoRiesgo.color}`}
            >
              {riesgo.score}/100 · {infoRiesgo.label}
            </span>
          </div>
          {explicacionIA && (
            <p className="mb-2 text-sm text-slate-700">{explicacionIA}</p>
          )}
          <p className="text-xs text-slate-500">
            Estimación propia a partir de magnitud, profundidad y cercanía a
            poblados{riesgo.distanciaKm != null ? ` (~${riesgo.distanciaKm} km)` : ""}.
            No es una medición oficial de intensidad sísmica.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {sismo.closerTowns && (
            <p className="mb-2">
              <span className="font-medium">Poblaciones cercanas:</span>{" "}
              {sismo.closerTowns}
            </p>
          )}
          <p className="mb-2">
            <span className="font-medium">Percepción reportada:</span>{" "}
            {sismo.felt > 0
              ? `${sismo.felt} reportes de "lo sentí"`
              : "Sin reportes de percepción registrados aún"}
          </p>
          {sismo.mmi != null && (
            <p className="mb-2">
              <span className="font-medium">Intensidad (MMI):</span>{" "}
              {sismo.mmi}
            </p>
          )}
          <p className="text-xs text-slate-500">
            Hora UTC: {sismo.utcTime} · Última actualización del SGC:{" "}
            {sismo.updated}
          </p>
        </div>

        <a
          href="https://www.sgc.gov.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Ver boletines oficiales en sgc.gov.co →
        </a>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          El SGC reporta sismos después de que ocurren, típicamente en
          minutos. Esta app no predice terremotos.
        </div>
      </section>
    </main>
  );
}
