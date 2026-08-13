"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { moderarTexto } from "@/lib/ai";
import {
  actualizarEstadoAcopio,
  crearAcopio,
  AcopioError,
  type EstadoAcopio,
} from "@/lib/acopios";

function cookieDelAcopio(id: number): string {
  return `acopio_token_${id}`;
}

export async function crearAcopioAction(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "");
  const recibe = String(formData.get("recibe") ?? "");

  const moderacion = await moderarTexto(`${nombre}\n${recibe}`);
  if (!moderacion.permitido) {
    redirect(
      `/acopios/nuevo?error=${encodeURIComponent(
        moderacion.razon || "Este contenido no se puede publicar.",
      )}`,
    );
  }

  let id: number;
  let managementToken: string;
  try {
    const resultado = await crearAcopio({
      nombre,
      recibe,
      horario: formData.get("horario"),
      lat: formData.get("lat"),
      lon: formData.get("lon"),
      locationLabel: formData.get("locationLabel"),
      contact: formData.get("contact"),
    });
    id = resultado.acopio.id;
    managementToken = resultado.managementToken;
  } catch (err) {
    const mensaje =
      err instanceof AcopioError ? err.message : "No se pudo crear el acopio.";
    redirect(`/acopios/nuevo?error=${encodeURIComponent(mensaje)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(cookieDelAcopio(id), managementToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  redirect(`/acopios/${id}?nuevo=1`);
}

export async function desbloquearAcopioAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const codigo = String(formData.get("codigo") ?? "").trim();

  if (Number.isFinite(id) && codigo) {
    const cookieStore = await cookies();
    cookieStore.set(cookieDelAcopio(id), codigo, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
  }

  redirect(`/acopios/${id}`);
}

export async function actualizarEstadoAcopioAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = formData.get("status") as EstadoAcopio;

  if (Number.isFinite(id)) {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieDelAcopio(id))?.value;
    if (token) {
      try {
        await actualizarEstadoAcopio(id, token, status);
      } catch {
        // Código inválido o vencido: no rompemos la navegación, la página
        // simplemente seguirá mostrando el formulario de código.
      }
    }
  }

  redirect(`/acopios/${id}`);
}
