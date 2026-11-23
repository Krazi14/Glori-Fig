import { useMemo, useState } from 'react'
import type { Camion, CamionStatus, Firma, NuevoCamionInput } from '../types'
import { Icon } from '../components/Icon'
import { Modal, PageHeading, StatusChip, StepDot } from '../components/ui'

interface Props {
  camiones: Camion[]
  firmas: Firma[]
  onNuevo: (datos: NuevoCamionInput) => void
  onVerFirma: (id: string) => void
}

const filtros: { id: CamionStatus | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'en_espera', label: 'En espera' },
  { id: 'en_revision', label: 'En revisión' },
  { id: 'autorizado', label: 'Autorizados' },
  { id: 'rechazado', label: 'Rechazados' },
]

export function Camiones({ camiones, firmas, onNuevo, onVerFirma }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<CamionStatus | 'todos'>('todos')
  const [seleccionado, setSeleccionado] = useState<Camion | null>(null)
  const [nuevoOpen, setNuevoOpen] = useState(false)
  const [form, setForm] = useState({
    placa: '',
    conductor: '',
    origen: '',
    litros: '',
    temperatura: '',
    area: 'Calidad',
  })
  const [errores, setErrores] = useState<string[]>([])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return camiones.filter((c) => {
      const coincide =
        !q ||
        [c.id, c.placa, c.conductor, c.origen, c.firmaId].some((v) => v.toLowerCase().includes(q))
      return coincide && (filtro === 'todos' || c.estado === filtro)
    })
  }, [camiones, busqueda, filtro])

  const conteos = {
    todos: camiones.length,
    en_espera: camiones.filter((c) => c.estado === 'en_espera').length,
    en_revision: camiones.filter((c) => c.estado === 'en_revision').length,
    autorizado: camiones.filter((c) => c.estado === 'autorizado').length,
    rechazado: camiones.filter((c) => c.estado === 'rechazado').length,
  }

  const firmaDe = (camion: Camion) => firmas.find((f) => f.id === camion.firmaId)

  const submitNuevo = () => {
    const faltan: string[] = []
    if (!form.placa.trim()) faltan.push('placa')
    if (!form.conductor.trim()) faltan.push('conductor')
    if (!form.origen.trim()) faltan.push('punto de partida')
    if (!form.litros || Number(form.litros) <= 0) faltan.push('cantidad de leche')
    if (!form.temperatura || Number(form.temperatura) <= 0) faltan.push('temperatura')
    setErrores(faltan)
    if (faltan.length) return
    onNuevo({
      placa: form.placa.trim().toUpperCase(),
      conductor: form.conductor.trim(),
      origen: form.origen.trim(),
      litros: Number(form.litros),
      temperatura: Number(form.temperatura),
      area: form.area,
    })
    setNuevoOpen(false)
    setForm({ placa: '', conductor: '', origen: '', litros: '', temperatura: '', area: 'Calidad' })
    setErrores([])
  }

  return (
    <div className="fade-up">
      <PageHeading
        eyebrow="Logística de leche"
        title="Registro de camiones"
        description="Cada cisterna queda vinculada a una firma electrónica que autoriza su descarga. Así sabrás siempre qué camión puede avanzar."
        action={
          <button type="button" onClick={() => setNuevoOpen(true)} className="btn btn-primary">
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.5} />
            Nuevo registro
          </button>
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'En espera', valor: conteos.en_espera, icon: 'clock' as const, color: 'text-slate-500', bg: 'bg-slate-100' },
          { label: 'En revisión', valor: conteos.en_revision, icon: 'refresh' as const, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Autorizados', valor: conteos.autorizado, icon: 'checkDouble' as const, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Rechazados', valor: conteos.rechazado, icon: 'xCircle' as const, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((s) => (
          <div key={s.label} className="surface-card-sm flex items-center gap-3.5 p-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-extrabold leading-none text-ink">{s.valor}</p>
              <p className="mt-1 text-[11.5px] text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-line p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={`rounded-xl px-3 py-2 text-[12px] font-bold transition ${
                  filtro === f.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-[10.5px] ${filtro === f.id ? 'text-brand-100' : 'text-slate-400'}`}>
                  {conteos[f.id]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-[290px]">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar placa, código o conductor"
              className="field !py-2.5 !pl-10"
            />
          </div>
        </div>

        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[1020px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Registro</th>
                <th className="px-4 py-3.5">Camión / conductor</th>
                <th className="px-4 py-3.5">Punto de partida</th>
                <th className="px-4 py-3.5">Leche</th>
                <th className="px-4 py-3.5">Llegada</th>
                <th className="px-4 py-3.5">Firma que autoriza</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => {
                const firma = firmaDe(c)
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSeleccionado(c)}
                    className="cursor-pointer border-t border-line text-[12.5px] transition hover:bg-brand-50/50"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11.5px] font-bold text-brand-700">{c.id}</span>
                      <p className="mt-0.5 text-[10.5px] text-muted">{c.cisterna}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <Icon name="truck" className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-bold text-ink">{c.placa}</p>
                          <p className="text-[10.5px] text-muted">{c.conductor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[210px] px-4 py-4">
                      <p className="truncate text-[#435b74]">{c.origen}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted">
                        <Icon name="pin" className="h-3 w-3" /> {c.destino}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-ink">{c.litros.toLocaleString('es-PE')} L</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted">
                        <Icon name="thermometer" className="h-3 w-3" /> {c.temperatura} °C
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#435b74]">{c.llegada}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onVerFirma(c.firmaId)
                        }}
                        className="group inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 transition hover:bg-brand-50"
                      >
                        <Icon name="file" className="h-3.5 w-3.5 text-brand-600" />
                        <span className="font-mono text-[11px] font-bold text-brand-700">{c.firmaId}</span>
                        <Icon name="arrowRight" className="h-3 w-3 text-slate-300 group-hover:text-brand-600" />
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {firma && <StatusChip estado={firma.estado} />}
                    </td>
                    <td className="px-4 py-4">
                      <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Icon name="search" className="h-8 w-8 text-slate-300" />
              <p className="text-[13px] font-bold text-ink">No se encontraron camiones</p>
              <p className="text-[11.5px] text-muted">Prueba con otro número de placa o cambio de filtro.</p>
            </div>
          )}
        </div>
        <div className="border-t border-line px-5 py-3 text-[11px] text-muted">
          Mostrando <span className="font-bold text-ink">{filtrados.length}</span> de {camiones.length} registros
        </div>
      </section>

      <Modal
        open={!!seleccionado}
        onClose={() => setSeleccionado(null)}
        title={seleccionado ? `Camión ${seleccionado.placa}` : ''}
        subtitle={seleccionado ? `${seleccionado.id} · ${seleccionado.cisterna}` : ''}
        icon="truck"
        maxWidth="max-w-3xl"
      >
        {seleccionado && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Conductor', valor: seleccionado.conductor, icon: 'users' as const },
                { label: 'Punto de partida', valor: seleccionado.origen, icon: 'pin' as const },
                { label: 'Destino', valor: seleccionado.destino, icon: 'building' as const },
                { label: 'Área responsable', valor: seleccionado.area, icon: 'layers' as const },
                { label: 'Cantidad de leche', valor: `${seleccionado.litros.toLocaleString('es-PE')} litros`, icon: 'milk' as const },
                { label: 'Temperatura', valor: `${seleccionado.temperatura} °C`, icon: 'thermometer' as const },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                    <Icon name={d.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">{d.label}</p>
                    <p className="mt-0.5 text-[12.5px] font-semibold text-ink">{d.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            {(() => {
              const firma = firmaDe(seleccionado)
              if (!firma) return null
              return (
                <>
                  <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-brand-600">
                          Firma vinculada
                        </p>
                        <p className="mt-1 font-mono text-[13px] font-bold text-ink">{firma.id}</p>
                        <p className="mt-0.5 text-[12px] text-[#435b74]">{firma.titulo}</p>
                      </div>
                      <StatusChip estado={firma.estado} />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSeleccionado(null)
                        onVerFirma(firma.id)
                      }}
                      className="btn btn-primary mt-4 w-full sm:w-auto"
                    >
                      <Icon name="pen" className="h-4 w-4" />
                      Abrir en centro de firmas
                    </button>
                  </div>

                  <div>
                    <h3 className="mb-3 font-display text-[14px] font-bold text-ink">Recorrido de aprobación</h3>
                    <div className="space-y-0">
                      {firma.firmantes.map((f, i) => (
                        <div key={f.area} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <StepDot estado={f.estado} />
                            {i < firma.firmantes.length - 1 && <div className="my-1 w-px flex-1 bg-line" />}
                          </div>
                          <div className="flex flex-1 items-start justify-between gap-2 pb-4">
                            <div>
                              <p className="text-[12.5px] font-bold text-ink">{f.area}</p>
                              <p className="text-[10.5px] text-muted">{f.nombre}</p>
                            </div>
                            <span className="text-[11px] font-semibold text-muted">
                              {f.estado === 'listo' ? f.hora : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </Modal>

      <Modal
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
        title="Registrar nuevo camión"
        subtitle="Se creará automáticamente una solicitud de firma vinculada a este registro."
        icon="plus"
        footer={
          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={() => setNuevoOpen(false)} className="btn btn-outline">
              Cancelar
            </button>
            <button type="button" onClick={submitNuevo} className="btn btn-primary">
              <Icon name="check" className="h-4 w-4" />
              Guardar registro
            </button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="placa">Placa del camión *</label>
            <input id="placa" className="field" value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} placeholder="Ej. BXB-482" />
          </div>
          <div>
            <label className="field-label" htmlFor="conductor">Conductor *</label>
            <input id="conductor" className="field" value={form.conductor} onChange={(e) => setForm({ ...form, conductor: e.target.value })} placeholder="Nombre completo" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="origen">Punto de partida *</label>
            <input id="origen" className="field" value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} placeholder="Fundo, anexo o sector de origen" />
          </div>
          <div>
            <label className="field-label" htmlFor="litros">Cantidad de leche (L) *</label>
            <input id="litros" type="number" min="1" className="field" value={form.litros} onChange={(e) => setForm({ ...form, litros: e.target.value })} placeholder="Ej. 18500" />
          </div>
          <div>
            <label className="field-label" htmlFor="temperatura">Temperatura (°C) *</label>
            <input id="temperatura" type="number" step="0.1" min="1" className="field" value={form.temperatura} onChange={(e) => setForm({ ...form, temperatura: e.target.value })} placeholder="Ej. 4.2" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="area">Área que revisa</label>
            <select id="area" className="field" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
              <option>Calidad</option>
              <option>Producción</option>
              <option>Almacén y despacho</option>
              <option>Recepción</option>
            </select>
          </div>
        </div>
        {errores.length > 0 && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-[12px] text-rose-700">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            Completa: {errores.join(', ')}.
          </div>
        )}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-[11.5px] leading-relaxed text-brand-800">
          <Icon name="info" className="h-4 w-4 shrink-0" />
          El código del camión y el de su firma quedarán enlazados para que puedas rastrear la autorización desde cualquier vista.
        </div>
      </Modal>
    </div>
  )
}
