import { IconPhone } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="max-w-xl text-center text-xs leading-relaxed text-slate-500 sm:text-left">
            Datos del Servicio Geológico Colombiano (SGC), consultados en
            origen. Esta app <strong>no reemplaza</strong> a los organismos
            oficiales ni predice terremotos.
          </p>
          <a
            href="tel:123"
            className="flex shrink-0 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
          >
            <IconPhone className="h-4 w-4" />
            En emergencia llama al 123
          </a>
        </div>
      </div>
    </footer>
  );
}
