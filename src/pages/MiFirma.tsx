import type { Firma } from '../types'
import { Icon } from '../components/Icon'
import { SignaturePad } from '../components/SignaturePad'
import { PageHeading } from '../components/ui'

interface Props {
  firmaGuardada: string | null
  firmas: Firma[]
  onGuardar: (dataUrl: string) => void
  onEliminar: () => void
}

export function MiFirma({ firmaGuardada, firmas, onGuardar, onEliminar }: Props) {
  const consejos = [
    {
      icon: 'pen' as const,
      titulo: 'Hazla una sola vez',
      texto: 'Tu firma se guarda en este navegador y se reutiliza en cada documento que apruebes.',
      color: 'bg-brand-50 text-brand-600',
    },
    {
      icon: 'shield' as const,
      titulo: 'Trazabilidad total',
      texto: 'Cada aprobación queda ligada a tu nombre, área, hora y código de la solicitud.',
      color: 'bg-brand-50 text-brand-600',
    },
    {
      icon: 'info' as const,
      titulo: 'Consejo rápido',
      texto: 'Usa trazos firmes y evita demasiadas curvaturas para que se lea bien en los documentos.',
      color: 'bg-gloria-red-50 text-gloria-red-600',
    },
  ]

  return (
    <div className="fade-up">
      <PageHeading
        eyebrow="Tu identidad digital"
        title="Mi firma digital"
        description="Dibuja o escribe tu firma una vez y úsala para autorizar camiones y documentos de las áreas internas."
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
        <SignaturePad onSave={onGuardar} />

        <div className="space-y-5">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="font-display text-[15px] font-bold text-ink">Vista previa</h2>
                <p className="text-[11.5px] text-muted">Así se verá en tus documentos</p>
              </div>
              {firmaGuardada && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Activa
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="relative overflow-hidden rounded-2xl border border-line bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-inner">
                <div className="doc-lines pointer-events-none absolute inset-0 opacity-50" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="font-display text-[13px] font-extrabold text-brand-800">GLORIA</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Firma registrada</span>
                  </div>
                  <div className="flex h-[130px] items-center justify-center">
                    {firmaGuardada ? (
                      <img src={firmaGuardada} alt="Vista previa de tu firma digital" className="max-h-[110px] max-w-full object-contain pop" />
                    ) : (
                      <div className="text-center text-slate-300">
                        <Icon name="pen" className="mx-auto h-8 w-8" />
                        <p className="mt-2 font-script text-xl">Tu firma aparecerá aquí</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-between border-t border-dashed border-slate-300 pt-3">
                    <div>
                      <p className="text-[10px] font-bold text-ink">María Rojas</p>
                      <p className="text-[9.5px] text-muted">Coordinación de Calidad</p>
                    </div>
                    <span className="font-mono text-[9.5px] text-slate-400">FIR-USU-0001</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-[11.5px]">
                <div className="flex justify-between">
                  <span className="text-muted">Estado</span>
                  <span className={`font-bold ${firmaGuardada ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {firmaGuardada ? 'Lista para usar' : 'Pendiente de creación'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Fecha de registro</span>
                  <span className="font-semibold text-ink">23 nov 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Documentos firmados</span>
                  <span className="font-semibold text-ink">{firmas.filter((f) => f.estado === 'listo').length}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {firmaGuardada ? (
                  <a href={firmaGuardada} download="firma-glori.png" className="btn btn-primary flex-1 !text-[12px]">
                    <Icon name="download" className="h-4 w-4" />
                    Descargar PNG
                  </a>
                ) : (
                  <div className="btn btn-outline flex-1 cursor-default !text-[12px] opacity-60">
                    <Icon name="download" className="h-4 w-4" />
                    Descargar PNG
                  </div>
                )}
                {firmaGuardada && (
                  <button type="button" onClick={onEliminar} className="btn btn-danger !px-3 !text-[12px]" title="Eliminar firma">
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="surface-card-sm flex items-start gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name="lock" className="h-4 w-4" />
            </span>
            <p className="text-[11.5px] leading-relaxed text-[#556d85]">
              <strong className="text-ink">Uso interno.</strong> Esta es una demostración del frontend: la
              firma se guarda localmente y se enviará al backend cuando se conecte el sistema.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {consejos.map((c) => (
          <div key={c.titulo} className="surface-card p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
              <Icon name={c.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-[13.5px] font-bold text-ink">{c.titulo}</h3>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{c.texto}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
