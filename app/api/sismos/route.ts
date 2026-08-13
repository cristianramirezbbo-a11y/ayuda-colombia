import { NextResponse } from "next/server";
import { fetchSismosRecientes, fetchCatalogo } from "@/lib/sgc";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minMag = Number(searchParams.get("minMag") ?? 0);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const sismos = start && end
      ? await fetchCatalogo(start, end)
      : await fetchSismosRecientes();

    const filtrados = Number.isFinite(minMag) && minMag > 0
      ? sismos.filter((s) => s.mag >= minMag)
      : sismos;

    return NextResponse.json({
      source: "SGC",
      count: filtrados.length,
      consultedAt: new Date().toISOString(),
      sismos: filtrados,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Error desconocido consultando el SGC",
      },
      { status: 502 },
    );
  }
}
