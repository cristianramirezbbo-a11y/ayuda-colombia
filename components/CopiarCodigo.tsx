"use client";

import { useState } from "react";

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
    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4">
      <p className="mb-2 text-sm font-semibold text-emerald-900">
        ¡Guarda este código de gestión! No se puede recuperar si lo pierdes.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-white px-3 py-2 text-sm text-emerald-900 break-all">
          {codigo}
        </code>
        <button
          onClick={copiar}
          className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
        >
          {copiado ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
      <p className="mt-2 text-xs text-emerald-800">
        Este navegador ya quedó habilitado para editar el estado. Si usas
        otro dispositivo, necesitarás este código.
      </p>
    </div>
  );
}
