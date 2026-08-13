import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RegisterServiceWorker from "./register-sw";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sismos Colombia — Alertas y seguridad sísmica",
    template: "%s",
  },
  description:
    "Últimos sismos en Colombia según el Servicio Geológico Colombiano (SGC), guía de qué hacer y números de emergencia. No predice terremotos.",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  // Toda la interfaz usa colores claros fijos de Tailwind (bg-white,
  // text-slate-900, etc.) sin variantes para modo oscuro. Sin declarar
  // esto, Android/Chrome puede activar su "tema oscuro forzado" para la
  // página y invertir colores de forma inconsistente — el síntoma típico
  // es texto blanco sobre fondo blanco en botones. Declarar "light"
  // desactiva esa heurística.
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
