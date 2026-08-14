import Link from "next/link";
import { fetchSismosRecientes } from "@/lib/sgc";
import SismoMap from "@/components/SismoMap";
import SismoLista from "@/components/SismoLista";
import PageHeader from "@/components/PageHeader";
import EstadoFuente from "@/components/EstadoFuente";
import MapLegend from "@/components/MapLegend";
import {
  IconHeart,
  IconBox,
  IconChevronRight,
  IconAlert,
} from "@/components/icons";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const LEYENDA_MAGNITUD = [
  { color: "#dc2626", label: "M 6.0 o más" },
  { color: "#ea580c", label: "M 5.0 – 5.9" },
  { color: "#d97706", label: "M 4.0 – 4.9" },
  { color: "#2563eb", label: "M 3.0 – 3.9" },
  { color: "#6b7280", label: "Menor a M 3.0" },
];

export default async function Home() {
  let sismos: Awaited<ReturnType<typeof fetchSismosRecientes>> = [];
  let error: string | null = null;
  const consultedAt = new Date().toISOString();

  try {
    sismos = await fetchSismosRecientes();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error consultando el SGC";
  }

  return (
    <main>
      <PageHeader
        title="Sismos Colombia"
        subtitle={`Datos oficiales del Servicio Geológico Colombiano (SGC) · ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}`}
      />

      <section className="mx-auto max-w-5xl px-4 py-6">
        {/* Acciones rápidas */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/reportes"
            className="group flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-100 hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <IconHeart className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-amber-900">
                ¿Necesitas ayuda o viste que llegó?{" "}
                <strong>Repórtalo en el Mapa de ayuda</strong>.
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                Ver mapa de ayuda
                <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>

          <Link
            href="/acopios"
            className="group flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <IconBox className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-blue-900">
                ¿Tienes o buscas un <strong>punto de acopio</strong> de ayuda
                cerca?
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-blue-700">
                Ver centros de acopio
                <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        </div>

        {/* Estado de la fuente */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-blue-600 text-white">Últimos 5 días</span>
            <span className="chip bg-slate-200 text-slate-700">
              {sismos.length} sismos reportados
            </span>
          </div>
          <EstadoFuente ok={!error} consultedAt={consultedAt} />
        </div>

        {error ? (
          <div className="alert-error flex items-start gap-3">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">
                No se pudo consultar el SGC en este momento.
              </p>
              <p className="mt-1 text-red-600">
                {error} — La fuente oficial puede estar temporalmente caída.
                Reintenta en un momento.
              </p>
            </div>
          </div>
        ) : (
          <>
            <SismoMap sismos={sismos} />
            <div className="mt-3">
              <MapLegend items={LEYENDA_MAGNITUD} />
            </div>
          </>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            Lista de sismos
          </h2>
          <SismoLista sismos={sismos} />
        </div>
      </section>
    </main>
  );
}
