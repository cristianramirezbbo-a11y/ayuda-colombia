import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

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
    nombre: "Línea única de emergencias",
    numero: "123",
    detalle: "Policía, bomberos, ambulancia. Úsala primero en cualquier emergencia.",
  },
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
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {contactos.map((c) => (
        <li key={c.nombre} className="flex items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800">{c.nombre}</p>
            <p className="text-xs text-slate-500">{c.detalle}</p>
          </div>
          <a
            href={telHref(c.numero)}
            className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white"
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
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {enlaces.map((e) => (
        <li key={e.nombre} className="flex items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800">{e.nombre}</p>
            <p className="text-xs text-slate-500">{e.detalle}</p>
          </div>
          <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Sitio oficial
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function EmergenciaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold">Números de emergencia</h1>
          <p className="text-sm text-slate-300">
            Guardados para funcionar sin conexión a internet.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            Emergencia inmediata
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
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            ¿Buscas a una persona desaparecida?
          </h2>
          <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="mb-2">
              Si no sabes cómo contactarla y quieres pedir ayuda a la
              comunidad para encontrarla, puedes publicar un reporte en el{" "}
              <Link href="/reportes" className="font-semibold text-blue-700 underline">
                Mapa de ayuda
              </Link>{" "}
              con su nombre, última ubicación conocida y un contacto. Es
              público, temporal (se borra a los 7 días) y no está verificado
              por ninguna autoridad — úsalo como complemento, no como
              sustituto del reporte oficial.
            </p>
            <p>
              Para que quede legalmente registrado como una desaparición,
              contacta a:
            </p>
          </div>
          <ListaEnlaces enlaces={CANALES_DESAPARECIDOS} />
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Esta app no reemplaza a los organismos oficiales. El Mapa de ayuda
          es un tablero comunitario sin verificación, no un registro legal.
          En caso de duda sobre riesgo de vida, llama primero al{" "}
          <strong>123</strong>.
        </div>
      </section>
    </main>
  );
}
