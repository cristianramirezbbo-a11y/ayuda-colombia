import Link from "next/link";
import { fetchSismosRecientes } from "@/lib/sgc";
import SismoMap from "@/components/SismoMap";
import SismoLista from "@/components/SismoLista";
import NavBar from "@/components/NavBar";
import EstadoFuente from "@/components/EstadoFuente";

export const dynamic = "force-dynamic";
export const revalidate = 60;

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
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold">Sismos Colombia</h1>
          <p className="text-sm text-slate-300">
            Datos oficiales del Servicio Geológico Colombiano (SGC) ·{" "}
            {new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Link
            href="/reportes"
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:bg-amber-100"
          >
            <span className="text-sm font-medium text-amber-900">
              ¿Necesitas ayuda o viste que llegó? Repórtalo en el{" "}
              <strong>Mapa de ayuda</strong>.
            </span>
            <span className="shrink-0 text-sm font-semibold text-amber-700">
              Ver mapa →
            </span>
          </Link>

          <Link
            href="/acopios"
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 hover:bg-blue-100"
          >
            <span className="text-sm font-medium text-blue-900">
              ¿Tienes o buscas un <strong>punto de acopio</strong> de ayuda
              cerca?
            </span>
            <span className="shrink-0 text-sm font-semibold text-blue-700">
              Ver acopios →
            </span>
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              Últimos 5 días
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              {sismos.length} sismos reportados
            </span>
          </div>
          <EstadoFuente ok={!error} consultedAt={consultedAt} />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ No se pudo consultar el SGC: {error}
            <br />
            <span className="text-red-500">
              La fuente oficial puede estar temporalmente caída. Reintenta en un
              momento.
            </span>
          </div>
        ) : (
          <SismoMap sismos={sismos} />
        )}

        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            Lista de sismos
          </h2>
          <SismoLista sismos={sismos} />
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Datos: Servicio Geológico Colombiano (SGC) · Fuente consultada en
        origen, sin redistribución · Esta app no reemplaza a los organismos
        oficiales. En emergencia llama al <strong>123</strong>.
      </footer>
    </main>
  );
}
