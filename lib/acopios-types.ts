export type EstadoAcopio = "abierto" | "necesita_mas" | "lleno" | "cerrado";

export interface Acopio {
  id: number;
  nombre: string;
  recibe: string | null;
  horario: string | null;
  lat: number | null;
  lon: number | null;
  locationLabel: string | null;
  contact: string | null;
  status: EstadoAcopio;
  createdAt: string;
  updatedAt: string;
}

export const ESTADOS_ACOPIO_VALIDOS: EstadoAcopio[] = [
  "abierto",
  "necesita_mas",
  "lleno",
  "cerrado",
];

export const ESTADO_ACOPIO_INFO: Record<
  EstadoAcopio,
  { label: string; color: string }
> = {
  abierto: { label: "Abierto, recibiendo", color: "#16a34a" },
  necesita_mas: { label: "Necesita más donaciones", color: "#d97706" },
  lleno: { label: "Lleno por ahora", color: "#2563eb" },
  cerrado: { label: "Cerrado", color: "#64748b" },
};
