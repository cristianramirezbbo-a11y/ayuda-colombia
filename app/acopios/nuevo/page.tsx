import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import NuevoAcopioForm from "@/components/NuevoAcopioForm";
import { IconAlert } from "@/components/icons";

export const metadata: Metadata = {
  title: "Registrar acopio — Sismos Colombia",
};

export default async function NuevoAcopioPage(
  props: PageProps<"/acopios/nuevo">,
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <main>
      <PageHeader
        backHref="/acopios"
        backLabel="Centros de acopio"
        title="Registrar punto de acopio"
        subtitle="Visible públicamente en el mapa de acopios."
      />

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {error && (
          <div className="alert-error flex items-start gap-3">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <NuevoAcopioForm />
      </section>
    </main>
  );
}
