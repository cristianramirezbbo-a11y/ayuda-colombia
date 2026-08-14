import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import MochilaChecklist from "@/components/MochilaChecklist";
import { IconShield, IconAlert, IconCheck, IconWifiOff } from "@/components/icons";

export const metadata: Metadata = {
  title: "Qué hacer en un sismo — Sismos Colombia",
  description:
    "Guía de qué hacer antes, durante y después de un sismo en Colombia. Disponible sin conexión.",
};

function Seccion({
  titulo,
  icono,
  color,
  children,
}: {
  titulo: string;
  icono: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${color}`}
        >
          {icono}
        </span>
        <h2 className="text-base font-semibold text-slate-800">{titulo}</h2>
      </div>
      <div className="space-y-2 p-4 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}

export default function GuiaPage() {
  return (
    <main>
      <PageHeader
        title="Qué hacer en un sismo"
        subtitle={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
              <IconWifiOff className="h-3.5 w-3.5" />
              Funciona sin conexión
            </span>{" "}
            <span className="ml-1">
              Guárdala en tu teléfono antes de que la necesites.
            </span>
          </>
        }
      />

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <Seccion
          titulo="Antes"
          icono={<IconShield className="h-4 w-4" />}
          color="bg-blue-600"
        >
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

        <Seccion
          titulo="Durante"
          icono={<IconAlert className="h-4 w-4" />}
          color="bg-orange-500"
        >
          <p className="rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-800">
            Agáchate, cúbrete y agárrate.
          </p>
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

        <Seccion
          titulo="Después"
          icono={<IconCheck className="h-4 w-4" />}
          color="bg-emerald-600"
        >
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

        <div className="alert-warn">
          Esta guía es informativa y no reemplaza a los organismos oficiales.
          En una emergencia real, llama al <strong>123</strong>.
        </div>
      </section>
    </main>
  );
}
