import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ReporteMap from "@/components/ReporteMap";
import MapLegend from "@/components/MapLegend";
import { CATEGORIA_INFO, CATEGORIAS_VALIDAS, type Reporte } from "@/lib/reportes-types";
import { listarReportesActivos } from "@/lib/reportes";
import { marcarResueltoAction } from "./actions";
import { IconPlus, IconCheck, IconAlert, IconHeart } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mapa de ayuda — Sismos Colombia",
  description:
    "Reportes públicos en tiempo real: ayuda que llegó, quién necesita ayuda o algo específico, y personas desaparecidas, con ubicación en el mapa.",
};

export const dynamic = "force-dynamic";

function hace(iso: string): string {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return "justo ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  return `hace ${Math.round(horas / 24)} d`;
}

const LEYENDA = CATEGORIAS_VALIDAS.map((c) => ({
  color: CATEGORIA_INFO[c].color,
  label: CATEGORIA_INFO[c].label,
}));

export default async function ReportesPage() {
  let reportes: Reporte[] = [];
  let dbError = false;
  try {
    reportes = await listarReportesActivos();
  } catch {
    dbError = true;
  }

  return (
    <main>
      <PageHeader
        title="Mapa de ayuda"
        subtitle="Reportes públicos de la comunidad, con ubicación."
        actions={
          <Link href="/reportes/nuevo" className="btn-primary">
            <IconPlus className="h-4 w-4" />
            Reportar
          </Link>
        }
      />

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <div className="alert-warn flex items-start gap-3">
          <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            Cualquiera puede publicar aquí y es visible para todos — no
            publiques datos sensibles de terceros sin su consentimiento. Esta
            app no reemplaza a los organismos oficiales. Emergencia real: llama
            al <strong>123</strong>. Los reportes desaparecen solos a los 7
            días.
          </span>
        </div>

        {dbError && (
          <div className="alert-error flex items-start gap-3">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <strong>No se pudieron cargar los reportes.</strong> La base de
              datos no está respondiendo. Reintenta en un momento; mientras
              tanto, en una emergencia llama al <strong>123</strong>.
            </span>
          </div>
        )}

        <ReporteMap reportes={reportes} />
        <MapLegend items={LEYENDA} />

        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            {reportes.length === 0
              ? "Aún no hay reportes activos"
              : `${reportes.length} reporte${reportes.length === 1 ? "" : "s"} activo${reportes.length === 1 ? "" : "s"}`}
          </h2>

          {dbError ? (
            <div className="card flex flex-col items-center gap-2 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <IconAlert className="h-6 w-6" />
              </span>
              <p className="text-sm font-medium text-slate-600">
                La lista de reportes no está disponible por ahora.
              </p>
              <p className="text-xs text-slate-400">
                Reintenta en un momento. Si es una emergencia, llama al 123.
              </p>
            </div>
          ) : reportes.length === 0 ? (
            <div className="card flex flex-col items-center gap-2 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                <IconHeart className="h-6 w-6" />
              </span>
              <p className="text-sm font-medium text-slate-600">
                Aún no hay reportes activos.
              </p>
              <p className="text-xs text-slate-400">
                Sé el primero en reportar algo si es necesario.
              </p>
              <Link href="/reportes/nuevo" className="btn-secondary mt-2">
                <IconPlus className="h-4 w-4" />
                Hacer un reporte
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {reportes.map((r) => {
                const info = CATEGORIA_INFO[r.category];
                return (
                  <li
                    key={r.id}
                    className="card overflow-hidden"
                  >
                    <div
                      aria-hidden
                      className="h-1 w-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <span
                          className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.label}
                        </span>
                        <p className="text-sm font-medium text-slate-800">
                          {r.title}
                        </p>
                        {r.description && (
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {r.description}
                          </p>
                        )}
                        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
                          <span className="font-medium text-slate-600">
                            {hace(r.createdAt)}
                          </span>
                          {r.locationLabel && (
                            <>
                              <span aria-hidden>·</span>
                              <span>{r.locationLabel}</span>
                            </>
                          )}
                          {r.contact && (
                            <>
                              <span aria-hidden>·</span>
                              <span>Contacto: {r.contact}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <form action={marcarResueltoAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="btn-secondary shrink-0 !px-3 !py-1.5 text-xs"
                          title="Marcar como resuelto"
                        >
                          <IconCheck className="h-3.5 w-3.5" />
                          Resuelto
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
