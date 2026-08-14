import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AcopiosExplorer from "@/components/AcopiosExplorer";
import { listarAcopios } from "@/lib/acopios";
import type { Acopio } from "@/lib/acopios-types";
import { IconPlus, IconAlert } from "@/components/icons";

export const metadata: Metadata = {
  title: "Centros de acopio — Sismos Colombia",
  description:
    "Puntos de acopio de ayuda humanitaria en Colombia, con ubicación y estado actualizado por quien los administra.",
};

export const dynamic = "force-dynamic";

export default async function AcopiosPage() {
  let acopios: Acopio[] = [];
  let dbError = false;
  try {
    acopios = await listarAcopios();
  } catch {
    dbError = true;
  }

  return (
    <main>
      <PageHeader
        title="Centros de acopio"
        subtitle="Puntos de ayuda humanitaria con estado actualizado."
        actions={
          <Link href="/acopios/nuevo" className="btn-primary">
            <IconPlus className="h-4 w-4" />
            Registrar acopio
          </Link>
        }
      />

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <div className="alert-warn flex items-start gap-3">
          <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            Cualquiera puede registrar un punto de acopio. No están verificados
            por ninguna autoridad — confirma antes de movilizarte. Quien lo crea
            recibe un código para mantener su estado actualizado.
          </span>
        </div>

        {dbError && (
          <div className="alert-error flex items-start gap-3">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <strong>No se pudieron cargar los acopios.</strong> La base de
              datos no está respondiendo. Reintenta en un momento; mientras
              tanto, en una emergencia llama al <strong>123</strong>.
            </span>
          </div>
        )}

        <AcopiosExplorer acopios={acopios} dbError={dbError} />
      </section>
    </main>
  );
}
