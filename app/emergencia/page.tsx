import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  IconPhone,
  IconArrowRight,
  IconAlert,
  IconUsers,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Números de emergencia — Sismos Colombia",
  description:
    "Números de emergencia nacionales de Colombia: línea única 123, Cruz Roja, Bomberos, Defensa Civil y UNGRD. Disponible sin conexión.",
};

interface Contacto {
  nombre: string;
  numero: string;
  detalle: string;
}

interface Enlace {
  nombre: string;
  url: string;
  detalle: string;
}

const NACIONALES: Contacto[] = [
  {
    nombre: "Cruz Roja Colombiana",
    numero: "132",
    detalle: "Atención prehospitalaria y ayuda humanitaria.",
  },
  {
    nombre: "Bomberos",
    numero: "119",
    detalle: "Incendios y rescates.",
  },
  {
    nombre: "Defensa Civil Colombiana",
    numero: "144",
    detalle: "Apoyo en desastres y rescate.",
  },
];

// UNGRD y SGC no tienen una línea de emergencia de atención ciudadana
// verificada para incluir aquí: enlazamos a sus portales oficiales en vez
// de arriesgarnos a publicar un número incorrecto.
const INSTITUCIONALES: Enlace[] = [
  {
    nombre: "UNGRD — Unidad Nacional para la Gestión del Riesgo de Desastres",
    url: "https://portal.gestiondelriesgo.gov.co",
    detalle: "Coordinación nacional de la respuesta a desastres.",
  },
  {
    nombre: "Servicio Geológico Colombiano (SGC)",
    url: "https://www.sgc.gov.co",
    detalle: "Reportes técnicos oficiales de sismicidad.",
  },
];

// No enlazamos a formularios o subpáginas específicas de estas entidades
// porque no pudimos verificar una URL exacta y vigente: mejor mandar a la
// portada oficial que arriesgar un enlace roto o desactualizado.
const CANALES_DESAPARECIDOS: Enlace[] = [
  {
    nombre: "Fiscalía General de la Nación",
    url: "https://www.fiscalia.gov.co",
    detalle: "Para denunciar formalmente una desaparición.",
  },
  {
    nombre: "Instituto Nacional de Medicina Legal y Ciencias Forenses",
    url: "https://www.medicinalegal.gov.co",
    detalle:
      "Administra el registro nacional de personas desaparecidas (SIRDEC).",
  },
  {
    nombre: "Cruz Roja Colombiana",
    url: "https://www.cruzrojacolombiana.org",
    detalle: "Servicio de restablecimiento del contacto familiar.",
  },
];

function telHref(numero: string): string {
  return `tel:${numero.replace(/[^\d+]/g, "")}`;
}

function ListaContactos({ contactos }: { contactos: Contacto[] }) {
  return (
    <ul className="card divide-y divide-slate-100 overflow-hidden">
      {contactos.map((c) => (
        <li key={c.nombre} className="flex items-center gap-4 px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <IconPhone className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">{c.nombre}</p>
            <p className="text-xs text-slate-500">{c.detalle}</p>
          </div>
          <a
            href={telHref(c.numero)}
            className="btn-primary shrink-0 !rounded-full"
          >
            Llamar {c.numero}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ListaEnlaces({ enlaces }: { enlaces: Enlace[] }) {
  return (
    <ul className="card divide-y divide-slate-100 overflow-hidden">
      {enlaces.map((e) => (
        <li key={e.nombre} className="flex items-center gap-4 px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">{e.nombre}</p>
            <p className="text-xs text-slate-500">{e.detalle}</p>
          </div>
          <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0 !rounded-full"
          >
            Sitio oficial
            <IconArrowRight className="h-3.5 w-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function EmergenciaPage() {
  return (
    <main>
      <PageHeader
        title="Números de emergencia"
        subtitle="Guardados para funcionar sin conexión a internet."
      />

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {/* Llamada inmediata — la acción más importante de la app */}
        <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-5 text-white shadow-lg sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-200">
                Emergencia inmediata
              </p>
              <h2 className="mt-1 text-xl font-bold">
                ¿Hay una emergencia ahora mismo?
              </h2>
              <p className="mt-1 text-sm text-red-100">
                La línea única nacional atiende Policía, bomberos y ambulancia.
                Úsala primero en cualquier emergencia.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-white/15 p-4 sm:block">
              <IconPhone className="h-8 w-8" />
            </span>
          </div>
          <a
            href="tel:123"
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-xl font-bold text-red-700 shadow-md transition-colors hover:bg-red-50 active:scale-[0.99]"
          >
            <IconPhone className="h-6 w-6" />
            Llamar al 123
          </a>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            Otros números de emergencia
          </h2>
          <ListaContactos contactos={NACIONALES} />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            Instituciones
          </h2>
          <ListaEnlaces enlaces={INSTITUCIONALES} />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <IconUsers className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">
              ¿Buscas a una persona desaparecida?
            </h2>
          </div>
          <div className="mb-3 card p-4 text-sm leading-relaxed text-slate-700">
            <p className="mb-2">
              Si no sabes cómo contactarla y quieres pedir ayuda a la comunidad
              para encontrarla, puedes publicar un reporte en el{" "}
              <Link href="/reportes" className="font-semibold text-blue-700 underline">
                Mapa de ayuda
              </Link>{" "}
              con su nombre, última ubicación conocida y un contacto. Es
              público, temporal (se borra a los 7 días) y no está verificado
              por ninguna autoridad — úsalo como complemento, no como sustituto
              del reporte oficial.
            </p>
            <p>
              Para que quede legalmente registrado como una desaparición,
              contacta a:
            </p>
          </div>
          <ListaEnlaces enlaces={CANALES_DESAPARECIDOS} />
        </div>

        <div className="alert-warn flex items-start gap-3">
          <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            Esta app no reemplaza a los organismos oficiales. El Mapa de ayuda
            es un tablero comunitario sin verificación, no un registro legal.
            En caso de duda sobre riesgo de vida, llama primero al{" "}
            <strong>123</strong>.
          </span>
        </div>
      </section>
    </main>
  );
}
