"use client";

import { useSyncExternalStore } from "react";

const ITEMS = [
  "Agua embotellada (mínimo 3 litros por persona)",
  "Radio a pilas o de manivela",
  "Linterna y pilas de repuesto",
  "Copias de documentos de identidad y contactos importantes",
  "Medicinas esenciales y botiquín básico",
  "Silbato para pedir ayuda",
  "Dinero en efectivo",
  "Ropa de abrigo y zapatos cerrados",
  "Alimentos no perecederos",
  "Cargador portátil para el celular",
];

const STORAGE_KEY = "sismos-colombia:mochila-checklist";

type ChecklistState = Record<string, boolean>;

// Pequeño store externo respaldado por localStorage. Usamos
// useSyncExternalStore (en vez de leer localStorage en un efecto y llamar
// setState) porque localStorage es un sistema externo mutable: este hook
// evita el flash de contenido incorrecto durante la hidratación en SSR.
let cache: ChecklistState | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): ChecklistState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function getSnapshot(): ChecklistState {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function getServerSnapshot(): ChecklistState {
  return {};
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function toggleItem(item: string, current: ChecklistState) {
  cache = { ...current, [item]: !current[item] };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Ignorar si no hay almacenamiento disponible; la app sigue funcionando.
  }
  for (const listener of listeners) listener();
}

export default function MochilaChecklist() {
  const checked = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const total = ITEMS.length;
  const done = ITEMS.filter((item) => checked[item]).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Mochila de emergencia
        </h3>
        <span className="text-xs text-slate-500">
          {done}/{total}
        </span>
      </div>
      <ul className="space-y-2">
        {ITEMS.map((item) => (
          <li key={item}>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(checked[item])}
                onChange={() => toggleItem(item, checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
              />
              <span className={checked[item] ? "text-slate-400 line-through" : ""}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
