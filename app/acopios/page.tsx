import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AcopioMap from "@/components/AcopioMap";
import { ESTADO_ACOPIO_INFO } from "@/lib/acopios-types";
import { listarAcopios } from "@/lib/acopios";

export const metadata: Metadata = {
  title: "Centros de acopio — Sismos Colombia",
  description:
    "Puntos de acopio de ayuda humanitaria en Colombia, con ubicación y estado actualizado por quien los administra.",
};

export const dynamic = "force-dynamic";

export default async function AcopiosPage() {
  const acopios = await listarAcopios();

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Centros de acopio</h1>
              <p className="text-sm text-slate-300">
                Puntos de ayuda humanitaria con estado actualizado.
              </p>
            </div>
            <Link
              href="/acopios/nuevo"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              + Registrar acopio
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Cualquiera puede registrar un punto de acopio. No están verificados
          por ninguna autoridad — confirma antes de movilizarte. Quien lo crea
          recibe un código para mantener su estado actualizado.
        </div>

        <AcopioMap acopios={acopios} />

        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            {acopios.length === 0
              ? "Aún no hay acopios registrados"
              : `${acopios.length} punto${acopios.length === 1 ? "" : "s"} de acopio`}
          </h2>

          {acopios.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              Registra el primero si conoces uno activo.
            </div>
          ) : (
            <ul className="space-y-2">
              {acopios.map((a) => {
                const info = ESTADO_ACOPIO_INFO[a.status];
                return (
                  <li key={a.id}>
                    <Link
                      href={`/acopios/${a.id}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
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
                            {a.nombre}
                          </p>
                          {a.recibe && (
                            <p className="mt-1 text-sm text-slate-600">
                              Recibe: {a.recibe}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">
                            {a.locationLabel}
                            {a.horario ? ` · ${a.horario}` : ""}
                            {a.contact ? ` · Contacto: ${a.contact}` : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
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
