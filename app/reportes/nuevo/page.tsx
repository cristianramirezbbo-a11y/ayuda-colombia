import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import NuevoReporteForm from "@/components/NuevoReporteForm";

export const metadata: Metadata = {
  title: "Nuevo reporte — Sismos Colombia",
};

export default async function NuevoReportePage(
  props: PageProps<"/reportes/nuevo">,
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold">Nuevo reporte</h1>
          <p className="text-sm text-slate-300">
            Visible públicamente en el mapa de ayuda.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <NuevoReporteForm />
      </section>
    </main>
  );
}
