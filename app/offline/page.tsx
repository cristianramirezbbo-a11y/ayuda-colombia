import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-800">Sin conexión</h1>
        <p className="mt-2 text-sm text-slate-600">
          No pudimos cargar esta página porque no hay internet. Los sismos en
          vivo necesitan conexión, pero la guía y los números de emergencia
          funcionan sin conexión.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/guia"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Ver guía: qué hacer en un sismo
          </Link>
          <Link
            href="/emergencia"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Ver números de emergencia
          </Link>
        </div>
      </section>
    </main>
  );
}
