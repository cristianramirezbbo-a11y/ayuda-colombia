"use client";

import { useState } from "react";
import { IconKey, IconCheck } from "./icons";

export default function CopiarCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // El navegador puede bloquear el clipboard; el código sigue visible.
    }
  }

  return (
    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <IconKey className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-emerald-900">
          ¡Guarda este código de gestión!{" "}
          <span className="font-normal">No se puede recuperar si lo pierdes.</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-white px-3 py-2.5 font-mono text-sm font-semibold text-emerald-900 break-all">
          {codigo}
        </code>
        <button
          onClick={copiar}
          className={`btn shrink-0 !px-3.5 ${
            copiado
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 text-white hover:bg-slate-700"
          }`}
        >
          {copiado ? (
            <>
              <IconCheck className="h-4 w-4" />
              ¡Copiado!
            </>
          ) : (
            "Copiar"
          )}
        </button>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-emerald-800">
        Este navegador ya quedó habilitado para editar el estado. Si usas otro
        dispositivo, necesitarás este código.
      </p>
    </div>
  );
}
