import { useState } from 'react'
import type { AreaInterna, Firma } from '../types'
import { flujoAreas } from '../data/mock'
import { Icon } from '../components/Icon'
import { Modal, PageHeading, StatusChip } from '../components/ui'

interface Props {
  areas: AreaInterna[]
  firmas: Firma[]
  onSolicitar: (datos: { area: string; titulo: string; documento: string; descripcion: string }) => void
  onVerFirmasArea: (area: string) => void
  onIrMiFirma: () => void
}

export function Areas({ areas, firmas, onSolicitar, onVerFirmasArea, onIrMiFirma }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ area: areas[0]?.nombre ?? 'Calidad', titulo: '', documento: '', descripcion: '' })
  const [error, setError] = useState('')

  const submit = () => {
    if (!form.titulo.trim() || !form.documento.trim()) {
      setError('Completa el título y el nombre del documento.')
      return
    }
    onSolicitar({
      area: form.area,
      titulo: form.titulo.trim(),
      documento: form.documento.trim(),
      descripcion: form.descripcion.trim() || 'Solicitud de firma interna enviada por el área responsable.',
    })
    setForm({ area: areas[0]?.nombre ?? 'Calidad', titulo: '', documento: '', descripcion: '' })
    setError('')
    setOpen(false)
  }

  return (
    <div className="fade-up">
      <PageHeading
        eyebrow="Trabajo en equipo"
        title="Áreas internas"
        description="Los documentos internos ya no se pierden entre escritorios. Cada área ve sus pendientes y firma en segundos."
        action={
          <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
            <Icon name="send" className="h-4 w-4" />
            Solicitar firma interna
          </button>
        }
      />

      <section className="surface-card mb-6 overflow-hidden p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[16px] font-bold text-ink">Flujo de una autorización</h2>
            <p className="text-[11.5px] text-muted">De la llegada del camión hasta la liberación de la cisterna</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            Tiempo total: 26 min promedio
          </span>
        </div>

        <div className="scroll-thin overflow-x-auto pb-2">
          <div className="flex min-w-[720px] items-start">
            {flujoAreas.map((paso, i) => (
              <div key={paso.nombre} className="flex flex-1 items-start">
                <div className="flex w-[130px] shrink-0 flex-col items-center text-center">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{ background: paso.color, boxShadow: `0 8px 18px ${paso.color}35` }}
                  >
                    <Icon name={paso.icon} className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-[12.5px] font-bold text-ink">{paso.nombre}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">{paso.tiempo}</p>
                </div>
                {i < flujoAreas.length - 1 && (
                  <div className="mt-7 flex flex-1 items-center px-1">
                    <div className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-line to-brand-200" />
                    <Icon name="chevronRight" className="h-4 w-4 -ml-2 text-brand-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[16px] font-bold text-ink">Estado por área</h2>
            <p className="text-[11.5px] text-muted">Toca un área para ver sus solicitudes en el centro de firmas.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((a) => {
            const pendientesReales = firmas.filter((f) => f.area === a.nombre && f.estado === 'pendiente').length
            return (
              <div key={a.id} className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start gap-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{ background: a.color }}
                  >
                    <Icon name={a.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-display text-[14px] font-bold text-ink">{a.nombre}</h3>
                      {pendientesReales > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          {pendientesReales} pend.
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted">Responsable: {a.responsable}</p>
                  </div>
                </div>
                <p className="mt-4 min-h-[36px] text-[11.5px] leading-relaxed text-[#556d85]">{a.descripcion}</p>
                <div className="mt-4 flex items-center justify-between text-[11px]">
                  <span className="text-muted">Tiempo promedio</span>
                  <span className="font-bold text-ink">{a.promedio}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(25, 100 - Number.parseInt(a.promedio) * 5)}%`, background: a.color }} />
                </div>
                <button
                  type="button"
                  onClick={() => onVerFirmasArea(a.nombre)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-[12px] font-bold text-[#435b74] transition group-hover:bg-brand-50 group-hover:text-brand-700"
                >
                  Ver firmas del área
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="surface-card relative mt-6 flex flex-col gap-5 overflow-hidden bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 p-6 text-white sm:flex-row sm:items-center sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-gloria-red-500/30" />
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Icon name="pen" className="h-6 w-6" />
        </span>
        <div className="relative flex-1">
          <h2 className="font-display text-[16px] font-bold">¿Todavía pasas hojas para firmar?</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-brand-100">
            Crea tu firma digital una sola vez y úsala en los documentos de todas las áreas.
          </p>
        </div>
        <button type="button" onClick={onIrMiFirma} className="btn relative bg-white text-brand-700 hover:bg-brand-50">
          Crear mi firma
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </section>

      <div className="mt-4 flex flex-wrap gap-2">
        {firmas.filter((f) => f.scope === 'area').slice(0, 3).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onVerFirmasArea(f.area)}
            className="surface-card-sm flex items-center gap-2 px-3 py-2 text-[11px] text-muted transition hover:border-brand-200"
          >
            <Icon name="file" className="h-3.5 w-3.5 text-brand-500" />
            <span className="font-mono font-bold text-ink">{f.id}</span>
            <StatusChip estado={f.estado} />
          </button>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Solicitar firma interna"
        subtitle="La solicitud aparecerá en el centro de firmas con estado pendiente."
        icon="send"
        footer={
          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-outline">Cancelar</button>
            <button type="button" onClick={submit} className="btn btn-primary">
              <Icon name="send" className="h-4 w-4" />
              Enviar solicitud
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="area-solicitud">Área responsable</label>
            <select id="area-solicitud" className="field" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
              {areas.map((a) => <option key={a.id}>{a.nombre}</option>)}
              <option>Gerencia</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="titulo-solicitud">Título de la firma *</label>
            <input id="titulo-solicitud" className="field" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej. Visto bueno de planilla diaria" />
          </div>
          <div>
            <label className="field-label" htmlFor="documento-solicitud">Documento a firmar *</label>
            <input id="documento-solicitud" className="field" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} placeholder="Ej. Informe LAB-2291" />
          </div>
          <div>
            <label className="field-label" htmlFor="desc-solicitud">Descripción</label>
            <textarea id="desc-solicitud" rows={3} className="field resize-none" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Cuéntale al área de qué se trata..." />
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-[12px] text-rose-700">
              <Icon name="alert" className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
