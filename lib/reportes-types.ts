// Tipos y constantes puros, sin dependencias de servidor: importable desde
// componentes cliente (ej. el mapa) sin arrastrar el driver de Postgres al bundle.

export type CategoriaReporte =
  | "ayuda_llegada"
  | "necesito_ayuda"
  | "necesito_algo"
  | "desaparecido";

export interface Reporte {
  id: number;
  category: CategoriaReporte;
  title: string;
  description: string | null;
  lat: number | null;
  lon: number | null;
  locationLabel: string | null;
  contact: string | null;
  status: "activo" | "resuelto";
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIAS_VALIDAS: CategoriaReporte[] = [
  "ayuda_llegada",
  "necesito_ayuda",
  "necesito_algo",
  "desaparecido",
];

export const CATEGORIA_INFO: Record<
  CategoriaReporte,
  { label: string; color: string; placeholder: string }
> = {
  ayuda_llegada: {
    label: "Ayuda llegó",
    color: "#16a34a",
    placeholder: "Ej. Llegó agua potable al polideportivo",
  },
  necesito_ayuda: {
    label: "Necesito ayuda",
    color: "#dc2626",
    placeholder: "Ej. Familia atrapada, edificio colapsado",
  },
  necesito_algo: {
    label: "Necesito algo",
    color: "#d97706",
    placeholder: "Ej. Necesitamos agua y medicinas en este sector",
  },
  desaparecido: {
    label: "Persona desaparecida",
    color: "#7c3aed",
    placeholder: "Ej. Nombre de la persona que buscas",
  },
};
