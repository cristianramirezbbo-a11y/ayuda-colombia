import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import NuevoAcopioForm from "@/components/NuevoAcopioForm";

export const metadata: Metadata = {
  title: "Registrar acopio — Sismos Colombia",
};

export default async function NuevoAcopioPage(
  props: PageProps<"/acopios/nuevo">,
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold">Registrar punto de acopio</h1>
          <p className="text-sm text-slate-300">
            Visible públicamente en el mapa de acopios.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <NuevoAcopioForm />
      </section>
    </main>
  );
}
