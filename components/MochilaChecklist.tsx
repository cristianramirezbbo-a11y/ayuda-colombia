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

const ESTADO_INICIAL: ChecklistState = {};

function getServerSnapshot(): ChecklistState {
  // Debe devolver siempre la misma referencia para que React no detecte
  // un "cambio" y entre en bucle de render durante la hidratación.
  return ESTADO_INICIAL;
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

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Mochila de emergencia
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {done}/{total}{done === total && " · ¡Lista!"}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-label="Progreso de la mochila de emergencia"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              done === total ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-1 p-4">
        {ITEMS.map((item) => {
          const hecho = Boolean(checked[item]);
          return (
            <li key={item}>
              <label
                className={`-mx-2 flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  hecho ? "text-slate-400" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={hecho}
                  onChange={() => toggleItem(item, checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-red-600"
                />
                <span className={hecho ? "line-through" : ""}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
