import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AcopioMap from "@/components/AcopioMap";
import CopiarCodigo from "@/components/CopiarCodigo";
import { ESTADO_ACOPIO_INFO, type EstadoAcopio } from "@/lib/acopios-types";
import { obtenerAcopioPorId } from "@/lib/acopios";
import { actualizarEstadoAcopioAction, desbloquearAcopioAction } from "../actions";
import { IconClock, IconUsers, IconMapPin, IconPhone, IconKey, IconCheck, IconAlert } from "@/components/icons";

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
  const codigoInvalido = searchParams.error === "codigo_invalido";
  const info = ESTADO_ACOPIO_INFO[acopio.status];

  return (
    <main>
      <PageHeader
        backHref="/acopios"
        backLabel="Centros de acopio"
        title={acopio.nombre}
        subtitle="Punto de acopio de ayuda humanitaria."
        actions={
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white"
            style={{ backgroundColor: info.color }}
          >
            <span aria-hidden className="h-2 w-2 rounded-[3px] bg-white/70" />
            {info.label}
          </span>
        }
      />

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        {esNuevo && token && <CopiarCodigo codigo={token} />}

        <AcopioMap acopios={[acopio]} />

        <dl className="card divide-y divide-slate-100 p-4">
          {acopio.recibe && (
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="w-28 shrink-0 text-xs font-medium text-slate-500">
                Recibe
              </dt>
              <dd className="text-sm text-slate-700">{acopio.recibe}</dd>
            </div>
          )}
          {acopio.horario && (
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="flex w-28 shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                <IconClock className="h-3.5 w-3.5 shrink-0" />
                Horario
              </dt>
              <dd className="text-sm text-slate-700">{acopio.horario}</dd>
            </div>
          )}
          {acopio.locationLabel && (
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="flex w-28 shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                <IconMapPin className="h-3.5 w-3.5 shrink-0" />
                Ubicación
              </dt>
              <dd className="text-sm text-slate-700">{acopio.locationLabel}</dd>
            </div>
          )}
          {acopio.contact && (
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="flex w-28 shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                <IconPhone className="h-3.5 w-3.5 shrink-0" />
                Contacto
              </dt>
              <dd className="text-sm text-slate-700">{acopio.contact}</dd>
            </div>
          )}
        </dl>

        {token ? (
          <form
            action={actualizarEstadoAcopioAction}
            className="card p-4 sm:p-5"
          >
            <input type="hidden" name="id" value={id} />
            <div className="mb-3 flex items-center gap-2">
              <IconUsers className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-800">
                Actualizar estado
              </h2>
            </div>
            <p className="mb-3 text-xs text-slate-500">
              ¿Cuál es el estado actual del punto de acopio? El actual está
              resaltado.
            </p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((estado) => {
                const i = ESTADO_ACOPIO_INFO[estado];
                const esActual = acopio.status === estado;
                return (
                  <button
                    key={estado}
                    type="submit"
                    name="status"
                    value={estado}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 ${
                      esActual ? "ring-2 ring-slate-900/40 ring-offset-2" : "opacity-80"
                    }`}
                    style={{ backgroundColor: i.color }}
                  >
                    {esActual && <IconCheck className="h-3.5 w-3.5" />}
                    {i.label}
                  </button>
                );
              })}
            </div>
          </form>
        ) : (
          <form
            action={desbloquearAcopioAction}
            className="card p-4 sm:p-5"
          >
            <input type="hidden" name="id" value={id} />
            <div className="mb-2 flex items-center gap-2">
              <IconKey className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-800">
                ¿Administras este acopio?
              </h2>
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Ingresa tu código de gestión para actualizar el estado.
            </p>
            {codigoInvalido && (
              <div className="alert-error mb-3 flex items-start gap-2">
                <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  El código no corresponde a este punto de acopio. Verifícalo
                  e inténtalo de nuevo.
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                name="codigo"
                required
                autoFocus={codigoInvalido}
                placeholder="Código de gestión"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary shrink-0">
                Desbloquear
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
