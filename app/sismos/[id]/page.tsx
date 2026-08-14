import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SismoMap from "@/components/SismoMap";
import { fetchSismoPorId } from "@/lib/sgc";
import { calcularRiesgo, NIVEL_RIESGO_INFO } from "@/lib/riesgo";
import { explicarRiesgo } from "@/lib/ai";
import {
  IconGauge,
  IconLayers,
  IconClock,
  IconShield,
  IconUsers,
  IconAlert,
  IconArrowRight,
} from "@/components/icons";

export const dynamic = "force-dynamic";

function badgeColor(mag: number): string {
  if (mag >= 6) return "bg-red-600";
  if (mag >= 5) return "bg-orange-600";
  if (mag >= 4) return "bg-amber-600";
  if (mag >= 3) return "bg-blue-600";
  return "bg-slate-400";
}

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="card flex items-center gap-3 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {stat.icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {stat.label}
        </p>
        <p className="truncate text-base font-semibold text-slate-800">
          {stat.value}
        </p>
      </div>
    </div>
  );
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

  const stats: Stat[] = [
    {
      icon: <IconGauge className="h-4.5 w-4.5" />,
      label: "Magnitud",
      value: `M ${sismo.mag.toFixed(1)} ${sismo.magType}`,
    },
    {
      icon: <IconLayers className="h-4.5 w-4.5" />,
      label: "Profundidad",
      value: `${sismo.depth.toFixed(1)} km`,
    },
    {
      icon: <IconClock className="h-4.5 w-4.5" />,
      label: "Hora local",
      value: sismo.localTime,
    },
    {
      icon: <IconShield className="h-4.5 w-4.5" />,
      label: "Estado",
      value: sismo.status === "manual" ? "Revisado" : "Automático",
    },
  ];

  return (
    <main>
      <PageHeader
        backHref="/"
        backLabel="Todos los sismos"
        title={sismo.place}
        subtitle="Detectado hace unos minutos por el SGC — no es una predicción."
        actions={
          <span
            className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-lg ${badgeColor(sismo.mag)}`}
          >
            M{sismo.mag.toFixed(1)}
          </span>
        }
      />

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <SismoMap sismos={[sismo]} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Índice de riesgo estimado */}
        <div className="card p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Índice de riesgo estimado
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white ${infoRiesgo.color}`}
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white/80" />
              {riesgo.score}/100 · {infoRiesgo.label}
            </span>
          </div>

          <div
            className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={riesgo.score}
            aria-label={`Riesgo estimado ${riesgo.score} de 100`}
          >
            <div
              className={`h-full rounded-full transition-all ${infoRiesgo.color}`}
              style={{ width: `${riesgo.score}%` }}
            />
          </div>

          {explicacionIA && (
            <p className="mb-2 text-sm leading-relaxed text-slate-700">
              {explicacionIA}
            </p>
          )}
          <p className="text-xs leading-relaxed text-slate-500">
            Estimación propia a partir de magnitud, profundidad y cercanía a
            poblados
            {riesgo.distanciaKm != null ? ` (~${riesgo.distanciaKm} km)` : ""}.
            No es una medición oficial de intensidad sísmica.
          </p>
        </div>

        {/* Datos del SGC */}
        <dl className="card divide-y divide-slate-100 p-4">
          {sismo.closerTowns && (
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="w-40 shrink-0 text-xs font-medium text-slate-500">
                Poblaciones cercanas
              </dt>
              <dd className="text-sm text-slate-700">{sismo.closerTowns}</dd>
            </div>
          )}
          <div className="flex items-start justify-between gap-4 py-2">
            <dt className="w-40 shrink-0 text-xs font-medium text-slate-500">
              Percepción reportada
            </dt>
            <dd className="flex items-center gap-1.5 text-sm text-slate-700">
              <IconUsers className="h-4 w-4 shrink-0 text-slate-400" />
              {sismo.felt > 0
                ? `${sismo.felt} reportes de "lo sentí"`
                : "Sin reportes de percepción aún"}
            </dd>
          </div>
          {sismo.mmi != null && (
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="w-40 shrink-0 text-xs font-medium text-slate-500">
                Intensidad (MMI)
              </dt>
              <dd className="text-sm text-slate-700">{sismo.mmi}</dd>
            </div>
          )}
          <div className="flex items-start justify-between gap-4 py-2">
            <dt className="w-40 shrink-0 text-xs font-medium text-slate-500">
              Actualización
            </dt>
            <dd className="text-xs text-slate-500">
              Hora UTC: {sismo.utcTime} · SGC: {sismo.updated}
            </dd>
          </div>
        </dl>

        <a
          href="https://www.sgc.gov.co"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Ver boletines oficiales en sgc.gov.co
          <IconArrowRight className="h-4 w-4" />
        </a>

        <div className="alert-warn flex items-start gap-3">
          <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            El SGC reporta sismos <strong>después</strong> de que ocurren,
            típicamente en minutos. Esta app no predice terremotos.
          </span>
        </div>
      </section>
    </main>
  );
}
