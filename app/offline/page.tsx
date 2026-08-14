import Link from "next/link";
import { IconWifiOff, IconBook, IconPhone } from "@/components/icons";

export default function OfflinePage() {
  return (
    <main>
      <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <IconWifiOff className="h-8 w-8" />
        </span>
        <h1 className="text-xl font-bold text-slate-800">Sin conexión</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          No pudimos cargar esta página porque no hay internet. Los sismos en
          vivo necesitan conexión, pero la guía y los números de emergencia
          funcionan sin conexión.
        </p>
        <div className="mt-8 w-full space-y-3">
          <Link
            href="/guia"
            className="btn-primary w-full !py-3"
          >
            <IconBook className="h-4 w-4" />
            Qué hacer en un sismo
          </Link>
          <Link
            href="/emergencia"
            className="btn-secondary w-full !py-3"
          >
            <IconPhone className="h-4 w-4" />
            Números de emergencia
          </Link>
        </div>
      </section>
    </main>
  );
}
