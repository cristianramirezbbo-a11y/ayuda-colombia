"use server";

import { redirect } from "next/navigation";
import { crearReporte, marcarResuelto, ReporteError } from "@/lib/reportes";
import { moderarTexto } from "@/lib/ai";

export async function crearReporteAction(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");

  const moderacion = await moderarTexto(`${title}\n${description}`);
  if (!moderacion.permitido) {
    redirect(
      `/reportes/nuevo?error=${encodeURIComponent(
        moderacion.razon || "Este contenido no se puede publicar.",
      )}`,
    );
  }

  try {
    await crearReporte({
      category: formData.get("category"),
      title: formData.get("title"),
      description: formData.get("description"),
      lat: formData.get("lat"),
      lon: formData.get("lon"),
      locationLabel: formData.get("locationLabel"),
      contact: formData.get("contact"),
    });
  } catch (err) {
    const mensaje =
      err instanceof ReporteError ? err.message : "No se pudo crear el reporte.";
    redirect(`/reportes/nuevo?error=${encodeURIComponent(mensaje)}`);
  }

  redirect("/reportes");
}

export async function marcarResueltoAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (Number.isFinite(id)) {
    await marcarResuelto(id);
  }
  redirect("/reportes");
}
