import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import ReporteMap from "@/components/ReporteMap";
import { CATEGORIA_INFO } from "@/lib/reportes-types";
import { listarReportesActivos } from "@/lib/reportes";
import { marcarResueltoAction } from "./actions";

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

export default async function ReportesPage() {
  const reportes = await listarReportesActivos();

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Mapa de ayuda</h1>
              <p className="text-sm text-slate-300">
                Reportes públicos de la comunidad, con ubicación.
              </p>
            </div>
            <Link
              href="/reportes/nuevo"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              + Reportar
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Cualquiera puede publicar aquí y es visible para todos — no
          publiques datos sensibles de terceros sin su consentimiento. Esta
          app no reemplaza a los organismos oficiales. Emergencia real: llama
          al <strong>123</strong>. Los reportes desaparecen solos a los 7
          días.
        </div>

        <ReporteMap reportes={reportes} />

        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            {reportes.length === 0
              ? "Aún no hay reportes activos"
              : `${reportes.length} reporte${reportes.length === 1 ? "" : "s"} activo${reportes.length === 1 ? "" : "s"}`}
          </h2>

          {reportes.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              Sé el primero en reportar algo si es necesario.
            </div>
          ) : (
            <ul className="space-y-2">
              {reportes.map((r) => {
                const info = CATEGORIA_INFO[r.category];
                return (
                  <li
                    key={r.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span
                          className="mb-1 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.label}
                        </span>
                        <p className="text-sm font-medium text-slate-800">
                          {r.title}
                        </p>
                        {r.description && (
                          <p className="mt-1 text-sm text-slate-600">
                            {r.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                          {hace(r.createdAt)}
                          {r.locationLabel ? ` · ${r.locationLabel}` : ""}
                          {r.contact ? ` · Contacto: ${r.contact}` : ""}
                        </p>
                      </div>
                      <form action={marcarResueltoAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Marcar resuelto
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
