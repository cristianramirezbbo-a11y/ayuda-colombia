"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconPulse,
  IconHeart,
  IconBox,
  IconBook,
  IconPhone,
} from "./icons";

interface NavLink {
  href: string;
  /** Etiqueta larga (barra superior) */
  label: string;
  /** Etiqueta corta (tabs inferiores en móvil) */
  tabLabel: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

const LINKS: NavLink[] = [
  {
    href: "/",
    label: "Sismos en vivo",
    tabLabel: "Sismos",
    icon: IconPulse,
  },
  {
    href: "/reportes",
    label: "Mapa de ayuda",
    tabLabel: "Ayuda",
    icon: IconHeart,
  },
  {
    href: "/acopios",
    label: "Acopios",
    tabLabel: "Acopios",
    icon: IconBox,
  },
  {
    href: "/guia",
    label: "Qué hacer",
    tabLabel: "Guía",
    icon: IconBook,
  },
  {
    href: "/emergencia",
    label: "Emergencia",
    tabLabel: "123",
    icon: IconPhone,
  },
];

function esActivo(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Barra superior (escritorio) ─────────────────────────── */}
      <nav className="hidden border-b border-slate-800 bg-slate-900 md:block">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
              <IconPulse className="h-5 w-5" />
            </span>
            <span className="text-base font-bold text-white">
              Sismos Colombia
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {LINKS.map((link) => {
              const activo = esActivo(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activo ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activo
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <a
              href="tel:123"
              className="ml-2 flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500"
            >
              <IconPhone className="h-4 w-4" />
              Llamar al 123
            </a>
          </div>
        </div>
      </nav>

      {/* ── Tabs inferiores (móvil) ─────────────────────────────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Navegación principal"
      >
        <div className="grid grid-cols-5">
          {LINKS.map((link) => {
            const activo = esActivo(pathname, link.href);
            const Icon = link.icon;
            const esEmergencia = link.href === "/emergencia";
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activo ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  activo
                    ? "text-red-600"
                    : esEmergencia
                      ? "text-slate-400"
                      : "text-slate-500"
                }`}
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                    activo ? "bg-red-100" : ""
                  }`}
                >
                  {esEmergencia ? (
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${
                        activo ? "bg-red-600 ring-2 ring-red-200" : "bg-red-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </span>
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    activo ? "" : "font-medium"
                  }`}
                >
                  {link.tabLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
