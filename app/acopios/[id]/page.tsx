import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import AcopioMap from "@/components/AcopioMap";
import CopiarCodigo from "@/components/CopiarCodigo";
import { ESTADO_ACOPIO_INFO, type EstadoAcopio } from "@/lib/acopios-types";
import { obtenerAcopioPorId } from "@/lib/acopios";
import { actualizarEstadoAcopioAction, desbloquearAcopioAction } from "../actions";

const ESTADOS: EstadoAcopio[] = ["abierto", "necesita_mas", "lleno", "cerrado"];

export default async function AcopioDetallePage(
  props: PageProps<"/acopios/[id]">,
) {
  const { id: idParam } = await props.params;
  const searchParams = await props.searchParams;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const acopio = await obtenerAcopioPorId(id);
  if (!acopio) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(`acopio_token_${id}`)?.value;
  const esNuevo = searchParams.nuevo === "1";
  const info = ESTADO_ACOPIO_INFO[acopio.status];

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold">{acopio.nombre}</h1>
          <span
            className="mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: info.color }}
          >
            {info.label}
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        {esNuevo && token && <CopiarCodigo codigo={token} />}

        <AcopioMap acopios={[acopio]} />

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {acopio.recibe && (
            <p className="mb-2">
              <span className="font-medium">Recibe:</span> {acopio.recibe}
            </p>
          )}
          {acopio.horario && (
            <p className="mb-2">
              <span className="font-medium">Horario:</span> {acopio.horario}
            </p>
          )}
          {acopio.locationLabel && (
            <p className="mb-2">
              <span className="font-medium">Ubicación:</span>{" "}
              {acopio.locationLabel}
            </p>
          )}
          {acopio.contact && (
            <p>
              <span className="font-medium">Contacto:</span> {acopio.contact}
            </p>
          )}
        </div>

        {token ? (
          <form
            action={actualizarEstadoAcopioAction}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <input type="hidden" name="id" value={id} />
            <h2 className="mb-2 text-sm font-semibold text-slate-800">
              Actualizar estado
            </h2>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((estado) => {
                const i = ESTADO_ACOPIO_INFO[estado];
                return (
                  <button
                    key={estado}
                    type="submit"
                    name="status"
                    value={estado}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: i.color }}
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
          </form>
        ) : (
          <form
            action={desbloquearAcopioAction}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <input type="hidden" name="id" value={id} />
            <h2 className="mb-2 text-sm font-semibold text-slate-800">
              ¿Administras este acopio?
            </h2>
            <p className="mb-2 text-xs text-slate-500">
              Ingresa tu código de gestión para actualizar el estado.
            </p>
            <div className="flex gap-2">
              <input
                name="codigo"
                required
                placeholder="Código de gestión"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Desbloquear
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
