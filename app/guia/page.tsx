import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import MochilaChecklist from "@/components/MochilaChecklist";

export const metadata: Metadata = {
  title: "Qué hacer en un sismo — Sismos Colombia",
  description:
    "Guía de qué hacer antes, durante y después de un sismo en Colombia. Disponible sin conexión.",
};

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-2 text-base font-semibold text-slate-800">{titulo}</h2>
      <div className="space-y-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default function GuiaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold">Qué hacer en un sismo</h1>
          <p className="text-sm text-slate-300">
            Esta guía funciona sin conexión a internet. Guárdala en tu
            teléfono antes de que la necesites.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <Seccion titulo="Antes">
          <ul className="list-inside list-disc space-y-1">
            <li>
              Identifica los lugares más seguros de tu casa, colegio y
              trabajo: bajo mesas o escritorios firmes, lejos de ventanas y
              objetos que puedan caer.
            </li>
            <li>Ten siempre lista tu mochila de emergencia (ver abajo).</li>
            <li>
              Acuerda con tu familia un punto de encuentro fuera de la
              vivienda.
            </li>
            <li>
              Guarda los números de emergencia y esta app en tu pantalla de
              inicio.
            </li>
          </ul>
        </Seccion>

        <Seccion titulo="Durante">
          <p className="font-medium">Agáchate, cúbrete y agárrate.</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Agáchate al piso, cúbrete la cabeza y el cuello bajo un mueble
              resistente, y agárrate hasta que termine el movimiento.
            </li>
            <li>
              Si estás en la calle, aléjate de edificios, postes y cables
              eléctricos; busca un espacio abierto.
            </li>
            <li>
              Si vas en carro, detente en un lugar seguro lejos de puentes o
              estructuras y permanece dentro con el cinturón puesto.
            </li>
            <li>No uses ascensores. No corras hacia las escaleras.</li>
            <li>
              <strong>Sismo nocturno:</strong> mantén calzado cerca de la
              cama; protege tu cabeza con una almohada si no llegas a cubrirte
              bajo un mueble.
            </li>
            <li>
              <strong>Si estás en la playa o zona costera</strong> y el sismo
              es fuerte o dura mucho tiempo, aléjate de la costa y busca
              terreno alto de inmediato: puede generarse un tsunami. No
              esperes una alerta oficial para actuar.
            </li>
          </ul>
        </Seccion>

        <Seccion titulo="Después">
          <ul className="list-inside list-disc space-y-1">
            <li>
              Revisa si hay heridos y presta primeros auxilios básicos antes
              de mover a alguien.
            </li>
            <li>
              Verifica fugas de gas, daños eléctricos o estructurales antes
              de reingresar a un edificio. Si hay duda, no entres.
            </li>
            <li>Espera réplicas: pueden ocurrir minutos u horas después.</li>
            <li>
              Usa el teléfono solo para emergencias; las redes se congestionan
              rápido.
            </li>
            <li>
              Sigue la información oficial del SGC y UNGRD, no rumores de
              redes sociales.
            </li>
          </ul>
        </Seccion>

        <MochilaChecklist />

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Esta guía es informativa y no reemplaza a los organismos oficiales.
          En una emergencia real, llama al <strong>123</strong>.
        </div>
      </section>
    </main>
  );
}
