interface EstadoFuenteProps {
  ok: boolean;
  consultedAt: string; // ISO
}

export default function EstadoFuente({ ok, consultedAt }: EstadoFuenteProps) {
  const hora = new Date(consultedAt).toLocaleTimeString("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span
        className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`}
        aria-hidden
      />
      <span>
        SGC {ok ? "operativo" : "no responde"} · Consultado a las {hora}
      </span>
    </div>
  );
}
