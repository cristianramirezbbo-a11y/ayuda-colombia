import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import NuevoReporteForm from "@/components/NuevoReporteForm";
import { IconAlert } from "@/components/icons";

export const metadata: Metadata = {
  title: "Nuevo reporte — Sismos Colombia",
};

export default async function NuevoReportePage(
  props: PageProps<"/reportes/nuevo">,
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <main>
      <PageHeader
        backHref="/reportes"
        backLabel="Mapa de ayuda"
        title="Nuevo reporte"
        subtitle="Visible públicamente en el mapa de ayuda."
      />

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {error && (
          <div className="alert-error flex items-start gap-3">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <NuevoReporteForm />
      </section>
    </main>
  );
}
