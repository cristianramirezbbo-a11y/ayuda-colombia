import Link from "next/link";

const LINKS = [
  { href: "/", label: "Sismos en vivo" },
  { href: "/reportes", label: "Mapa de ayuda" },
  { href: "/acopios", label: "Acopios" },
  { href: "/guia", label: "Qué hacer" },
  { href: "/emergencia", label: "Emergencia" },
];

export default function NavBar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 whitespace-nowrap px-3 py-3 text-sm font-medium text-slate-300 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
