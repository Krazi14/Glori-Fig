import { useMemo, useState } from 'react'
import type { Camion, Firma, FirmaScope, FirmaStatus } from '../types'
import { Icon } from '../components/Icon'
import { Modal, PageHeading, StatusChip, StepDot } from '../components/ui'

interface Props {
  firmas: Firma[]
  camiones: Camion[]
  firmaGuardada: string | null
  busquedaInicial: string
  foco: { id: string; key: number } | null
  onAprobar: (id: string) => void
  onRechazar: (id: string, motivo: string) => void
}

type ScopeFiltro = 'todas' | FirmaScope
type EstadoFiltro = 'todos' | FirmaStatus

export function Firmas({
  firmas,
  camiones,
  firmaGuardada,
  busquedaInicial,
  foco,
  onAprobar,
  onRechazar,
}: Props) {
  const [scope, setScope] = useState<ScopeFiltro>('todas')
  const [estado, setEstado] = useState<EstadoFiltro>('todos')
  const [busqueda, setBusqueda] = useState(busquedaInicial)
  const [detalle, setDetalle] = useState<Firma | null>(() =>
    foco ? (firmas.find((f) => f.id === foco.id) ?? null) : null,
  )
  const [motivo, setMotivo] = useState('')

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return firmas.filter((f) => {
      const okScope = scope === 'todas' || f.scope === scope
      const okEstado = estado === 'todos' || f.estado === estado
      const camion = camiones.find((c) => c.id === f.camionId)
      const okBusqueda =
        !q ||
        [f.id, f.titulo, f.documento, f.area, f.solicitante, camion?.placa ?? '']
          .join(' ')
          .toLowerCase()
          .includes(q)
      return okScope && okEstado && okBusqueda
    })
  }, [firmas, camiones, scope, estado, busqueda])

  const conteos = {
    todas: firmas.length,
    camion: firmas.filter((f) => f.scope === 'camion').length,
    area: firmas.filter((f) => f.scope === 'area').length,
    pendiente: firmas.filter((f) => f.estado === 'pendiente').length,
    rechazado: firmas.filter((f) => f.estado === 'rechazado').length,
    listo: firmas.filter((f) => f.estado === 'listo').length,
  }

  const camionDe = (f: Firma) => camiones.find((c) => c.id === f.camionId)

  const aprobar = (f: Firma) => {
    onAprobar(f.id)
    setDetalle(null)
    setMotivo('')
  }

  const rechazar = (f: Firma) => {
    if (!motivo.trim()) return
    onRechazar(f.id, motivo.trim())
    setDetalle(null)
    setMotivo('')
  }

  return (
    <div className="fade-up">
      <PageHeading
        eyebrow="Flujo de aprobación"
        title="Centro de firmas"
        description="Firmas de camiones y de áreas internas en un solo lugar. Aprueba con un clic y el camión queda autorizado al instante."
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Pendientes', valor: conteos.pendiente, icon: 'clock' as const, cls: 'bg-amber-50 text-amber-600' },
          { label: 'Rechazadas', valor: conteos.rechazado, icon: 'xCircle' as const, cls: 'bg-rose-50 text-rose-600' },
          { label: 'Listas', valor: conteos.listo, icon: 'checkDouble' as const, cls: 'bg-emerald-50 text-emerald-600' },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setEstado(s.label === 'Pendientes' ? 'pendiente' : s.label === 'Rechazadas' ? 'rechazado' : 'listo')}
            className="surface-card-sm flex items-center gap-3.5 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.cls}`}>
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-extrabold leading-none text-ink">{s.valor}</p>
              <p className="mt-1 text-[11.5px] text-muted">{s.label}</p>
            </div>
          </button>
        ))}
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-line p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'todas' as ScopeFiltro, label: 'Todas', n: conteos.todas },
                { id: 'camion' as ScopeFiltro, label: 'Camiones', n: conteos.camion },
                { id: 'area' as ScopeFiltro, label: 'Áreas internas', n: conteos.area },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setScope(t.id)}
                  className={`rounded-xl px-3.5 py-2 text-[12px] font-bold transition ${
                    scope === t.id
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'bg-slate-50 text-slate-500 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {t.label}
                  <span className={`ml-1.5 text-[10.5px] ${scope === t.id ? 'text-brand-100' : 'text-slate-400'}`}>{t.n}</span>
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-[280px]">
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por código, placa o área"
                className="field !py-2.5 !pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Icon name="filter" className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Estado:</span>
            {(['todos', 'pendiente', 'rechazado', 'listo'] as EstadoFiltro[]).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEstado(e)}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold capitalize transition ${
                  estado === e ? 'bg-ink text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {e === 'todos' ? 'Todos' : e === 'listo' ? 'Listo' : e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 p-5 xl:grid-cols-2">
          {visibles.map((f) => {
            const camion = camionDe(f)
            const firmados = f.firmantes.filter((p) => p.estado === 'listo').length
            return (
              <article
                key={f.id}
                className={`group rounded-2xl border p-4 transition hover:shadow-md ${
                  foco?.id === f.id ? 'border-brand-400 ring-4 ring-brand-500/10' : 'border-line bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      f.scope === 'camion' ? 'bg-brand-50 text-brand-600' : 'bg-gloria-red-50 text-gloria-red-600'
                    }`}
                  >
                    <Icon name={f.scope === 'camion' ? 'truck' : 'layers'} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[13.5px] font-bold text-ink">{f.titulo}</h3>
                      <StatusChip estado={f.estado} />
                    </div>
                    <p className="mt-1 font-mono text-[10.5px] font-semibold text-brand-700">{f.id}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {f.documento} · {f.fecha}, {f.hora}
                    </p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-[11.5px] leading-relaxed text-[#556d85]">{f.descripcion}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {camion && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                      <Icon name="truck" className="h-3.5 w-3.5 text-brand-600" />
                      {camion.placa}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                    <Icon name="layers" className="h-3.5 w-3.5 text-gloria-red-500" />
                    {f.area}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                    <Icon name="checkDouble" className="h-3.5 w-3.5 text-emerald-500" />
                    {firmados}/{f.firmantes.length} firmas
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-line pt-3.5">
                  <button type="button" onClick={() => { setDetalle(f); setMotivo('') }} className="btn btn-outline flex-1 !py-2 !text-[12px]">
                    <Icon name="eye" className="h-4 w-4" />
                    Ver detalle
                  </button>
                  {f.estado === 'pendiente' && (
                    <>
                      <button type="button" onClick={() => rechazarDirecto(f)} className="btn btn-danger !px-3 !py-2 !text-[12px]" title="Rechazar">
                        <Icon name="x" className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => aprobar(f)} className="btn btn-success !px-3 !py-2 !text-[12px]">
                        <Icon name="check" className="h-4 w-4" />
                        Aprobar
                      </button>
                    </>
                  )}
                </div>
              </article>
            )
          })}
          {visibles.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <Icon name="file" className="h-7 w-7" />
              </span>
              <p className="text-[13px] font-bold text-ink">No hay firmas con estos filtros</p>
              <p className="text-[11.5px] text-muted">Cambia el tipo o el estado para ver más solicitudes.</p>
            </div>
          )}
        </div>
      </section>

      <Modal
        open={!!detalle}
        onClose={() => setDetalle(null)}
        title={detalle?.titulo ?? ''}
        subtitle={detalle ? `${detalle.id} · ${detalle.documento}` : ''}
        icon={detalle?.scope === 'camion' ? 'truck' : 'layers'}
        maxWidth="max-w-4xl"
      >
        {detalle && (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-inner">
                <div className="doc-lines pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between border-b-2 border-brand-700 pb-3">
                    <div>
                      <p className="font-display text-[17px] font-extrabold tracking-tight text-brand-800">GLORIA</p>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Documento electrónico</p>
                    </div>
                    <span
                      className={`rounded-lg border-2 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                        detalle.estado === 'listo'
                          ? 'border-emerald-400 text-emerald-600'
                          : detalle.estado === 'rechazado'
                            ? 'border-rose-400 text-rose-600'
                            : 'border-amber-300 text-amber-600'
                      }`}
                    >
                      {detalle.estado}
                    </span>
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Solicitud</p>
                  <p className="mt-1 text-[13px] font-bold text-ink">{detalle.titulo}</p>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
                    <div>
                      <p className="text-slate-400">Código</p>
                      <p className="font-mono font-bold text-ink">{detalle.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Documento</p>
                      <p className="font-semibold text-ink">{detalle.documento}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Solicitante</p>
                      <p className="font-semibold text-ink">{detalle.solicitante}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Área / fecha</p>
                      <p className="font-semibold text-ink">{detalle.area} · {detalle.hora}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] leading-relaxed text-[#556d85]">{detalle.descripcion}</p>
                  <div className="mt-8 flex items-end justify-between gap-3 border-t border-dashed border-slate-300 pt-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Firma digital</p>
                      {firmaGuardada ? (
                        <img src={firmaGuardada} alt="Firma digital guardada" className="mt-1 h-16 max-w-[190px] object-contain object-left" />
                      ) : (
                        <p className="mt-2 font-script text-xl text-slate-300">Sin firma registrada</p>
                      )}
                      <p className="text-[9.5px] text-muted">María Rojas · Calidad</p>
                    </div>
                    <Icon name="shield" className="h-8 w-8 text-brand-100" />
                  </div>
                </div>
              </div>

              {detalle.estado === 'rechazado' && detalle.motivoRechazo && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 p-3.5 text-[11.5px] leading-relaxed text-rose-800">
                  <Icon name="alert" className="h-4 w-4 shrink-0" />
                  <span><strong>Motivo del rechazo:</strong> {detalle.motivoRechazo}</span>
                </div>
              )}

              {detalle.estado === 'pendiente' && (
                <div className="rounded-2xl border border-line bg-slate-50/70 p-4">
                  <label className="field-label" htmlFor="motivo">Motivo del rechazo (si aplica)</label>
                  <textarea
                    id="motivo"
                    rows={2}
                    className="field resize-none"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Escribe qué debe corregirse antes de aprobar..."
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => aprobar(detalle)} className="btn btn-success flex-1">
                      <Icon name="checkDouble" className="h-4 w-4" />
                      Aprobar y liberar
                    </button>
                    <button type="button" onClick={() => rechazar(detalle)} disabled={!motivo.trim()} className="btn btn-danger">
                      <Icon name="xCircle" className="h-4 w-4" />
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line p-4">
                <h3 className="mb-4 font-display text-[14px] font-bold text-ink">Recorrido de firmas</h3>
                <div className="space-y-0">
                  {detalle.firmantes.map((f, i) => (
                    <div key={`${f.area}-${i}`} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <StepDot estado={f.estado} />
                        {i < detalle.firmantes.length - 1 && <div className="my-1 w-px flex-1 bg-line" />}
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-2 pb-5">
                        <div>
                          <p className="text-[12.5px] font-bold text-ink">{f.area}</p>
                          <p className="text-[10.5px] text-muted">{f.nombre}</p>
                        </div>
                        <span className="text-[10.5px] font-semibold text-muted">
                          {f.estado === 'listo' ? f.hora : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-brand-50/70 p-4">
                <div className="flex items-center gap-2 text-brand-700">
                  <Icon name="shield" className="h-4 w-4" />
                  <p className="text-[12px] font-bold">Firma verificable</p>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-brand-900/70">
                  Cada aprobación registra área, responsable y hora. Si el camión está autorizado, su
                  registro muestra el mismo código de firma.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )

  function rechazarDirecto(f: Firma) {
    setDetalle(f)
    setMotivo('')
  }
}
