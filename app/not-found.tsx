import Link from "next/link";
import { IconAlert, IconArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <main>
      <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <IconAlert className="h-8 w-8" />
        </span>
        <h1 className="text-xl font-bold text-slate-800">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Esta página no existe o ya no está disponible. Puede que el sismo o
          el punto de acopio hayan expirado.
        </p>
        <Link href="/" className="btn-primary mt-8">
          <IconArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
