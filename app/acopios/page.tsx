import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AcopiosExplorer from "@/components/AcopiosExplorer";
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

        <AcopiosExplorer acopios={acopios} />
      </section>
    </main>
  );
}
