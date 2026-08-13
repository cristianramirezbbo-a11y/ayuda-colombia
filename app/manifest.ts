import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sismos Colombia — Alertas y seguridad sísmica",
    short_name: "Sismos Colombia",
    description:
      "Últimos sismos en Colombia según el Servicio Geológico Colombiano (SGC), guía de qué hacer antes/durante/después, y números de emergencia.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "es-CO",
    categories: ["utilities", "news", "safety"],
    icons: [
      {
        src: "/manifest-icons/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manifest-icons/512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/manifest-icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
