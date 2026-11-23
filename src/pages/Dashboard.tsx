import { useMemo } from 'react'
import type { AreaInterna, Camion, Firma, PageId } from '../types'
import { Icon } from '../components/Icon'
import { StatusChip } from '../components/ui'

interface Props {
  camiones: Camion[]
  firmas: Firma[]
  areas: AreaInterna[]
  firmaGuardada: string | null
  onNavigate: (page: PageId) => void
  onVerFirma: (id: string) => void
}

export function Dashboard({ camiones, firmas, areas, firmaGuardada, onNavigate, onVerFirma }: Props) {
  const stats = useMemo(() => {
    const pendientes = firmas.filter((f) => f.estado === 'pendiente').length
    const listas = firmas.filter((f) => f.estado === 'listo').length
    const rechazadas = firmas.filter((f) => f.estado === 'rechazado').length
    const enPlanta = camiones.filter((c) => c.estado !== 'autorizado' && c.estado !== 'rechazado').length
    const enEspera = camiones.filter((c) => c.estado === 'en_espera').length
    return { pendientes, listas, rechazadas, enPlanta, enEspera }
  }, [camiones, firmas])

  const recientes = [...firmas].slice(0, 5)

  const valoresAvance = [96, 78, 64, 88]
  const avanceAreas = areas.slice(0, 4).map((a, i) => ({
    nombre: a.nombre,
    value: valoresAvance[i] ?? 70,
    color: a.color,
  }))

  const tarjetas = [
    {
      label: 'Camiones en planta',
      valor: stats.enPlanta,
      detalle: `${stats.enEspera} esperando firma`,
      icon: 'truck' as const,
      tono: 'bg-brand-50 text-brand-600',
      barra: 'bg-brand-500',
    },
    {
      label: 'Firmas pendientes',
      valor: stats.pendientes,
      detalle: 'Requieren tu revisión',
      icon: 'clock' as const,
      tono: 'bg-amber-50 text-amber-600',
      barra: 'bg-amber-500',
    },
    {
      label: 'Firmas aprobadas',
      valor: stats.listas,
      detalle: 'Hoy · todo en orden',
      icon: 'checkDouble' as const,
      tono: 'bg-emerald-50 text-emerald-600',
      barra: 'bg-emerald-500',
    },
    {
      label: 'Tiempo promedio',
      valor: '18 min',
      detalle: 'Antes: 2 h 15 min',
      icon: 'sparkles' as const,
      tono: 'bg-gloria-red-50 text-gloria-red-600',
      barra: 'bg-gloria-red-500',
    },
  ]

  return (
    <div className="space-y-6 fade-up">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl shadow-brand-900/15 sm:p-9">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gloria-red-500" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-gloria-red-500/20" />
        <div className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-3xl border border-white/10" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold tracking-wide text-brand-50 ring-1 ring-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-gloria-red-400" />
              <Icon name="sparkles" className="h-3.5 w-3.5 text-gloria-red-300" />
              Flujo de firmas digitales activo
            </span>
            <h1 className="mt-5 font-display text-[28px] font-extrabold leading-[1.15] tracking-tight sm:text-[38px]">
              Buenos días, Renzo <span className="inline-block origin-bottom-right">👋</span>
            </h1>
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-brand-100 sm:text-[15px]">
              Las firmas ya no viajan de área en área. Revisa, aprueba y libera cada camión desde un
              mismo lugar, en minutos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate('firmas')} className="btn bg-white text-brand-700 shadow-lg hover:bg-brand-50">
                <Icon name="pen" className="h-4 w-4" />
                Revisar firmas pendientes
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                  {stats.pendientes}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('camiones')}
                className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Icon name="truck" className="h-4 w-4" />
                Ver camiones
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-2 h-24 w-24 rounded-full bg-gloria-red-400/25 blur-xl" />
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <div className="overflow-hidden rounded-2xl bg-white text-ink shadow-xl">
                <div className="h-1.5 bg-gradient-to-r from-brand-600 via-brand-500 to-gloria-red-500" />
                <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="truck" className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold">Camión BXB-482</p>
                      <p className="text-[10.5px] text-muted">CAM-2026-0148</p>
                    </div>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                    <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                  </span>
                </div>
                <div className="mt-4 space-y-2.5">
                  {['Recepción', 'Calidad', 'Producción', 'Despacho'].map((label) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="flex-1 text-[11.5px] font-medium text-[#435b74]">{label}</span>
                      <StatusChip estado="listo" />
                    </div>
                  ))}
                </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
                    <span className="text-[11.5px] font-bold text-emerald-800">Descarga autorizada</span>
                    <span className="text-[10.5px] font-semibold text-emerald-600">08:09 a. m.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((t) => (
          <div key={t.label} className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.tono}`}>
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <span className={`h-2 w-2 rounded-full ${t.barra}`} />
            </div>
            <p className="mt-4 font-display text-[28px] font-extrabold leading-none text-ink">{t.valor}</p>
            <p className="mt-2 text-[12.5px] font-bold text-ink">{t.label}</p>
            <p className="mt-1 text-[11px] text-muted">{t.detalle}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="surface-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[16px] font-bold text-ink">Actividad reciente</h2>
              <p className="text-[11.5px] text-muted">Últimas solicitudes del día</p>
            </div>
            <button type="button" onClick={() => onNavigate('firmas')} className="btn btn-soft !px-3 !py-2 !text-[12px]">
              Ver todas
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {recientes.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onVerFirma(f.id)}
                className="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-slate-50"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    f.scope === 'camion' ? 'bg-brand-50 text-brand-600' : 'bg-gloria-red-50 text-gloria-red-600'
                  }`}
                >
                  <Icon name={f.scope === 'camion' ? 'truck' : 'layers'} className="h-[17px] w-[17px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-ink group-hover:text-brand-700">{f.titulo}</p>
                  <p className="truncate text-[10.5px] text-muted">
                    {f.id} · {f.documento}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <StatusChip estado={f.estado} />
                </div>
                <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-[16px] font-bold text-ink">Firmas por área</h2>
            <p className="text-[11.5px] text-muted">Avance de aprobación en tiempo real</p>
          </div>
          <div className="space-y-5">
            {avanceAreas.map((a) => (
              <div key={a.nombre}>
                <div className="mb-2 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-ink">{a.nombre}</span>
                  <span className="font-bold" style={{ color: a.color }}>
                    {a.value}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${a.value}%`, background: a.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-50 p-3.5">
            <Icon name="shield" className="h-5 w-5 shrink-0 text-brand-600" />
            <p className="text-[11.5px] leading-relaxed text-brand-900">
              <span className="font-bold">Todo trazable.</span> Cada firma queda registrada con área,
              responsable y hora exacta.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-[16px] font-bold text-ink">Accesos rápidos</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              titulo: 'Nuevo registro',
              desc: 'Registra un camión y genera su firma',
              icon: 'plus' as const,
              color: 'from-brand-500 to-brand-700',
              page: 'camiones' as PageId,
            },
            {
              titulo: 'Firmas internas',
              desc: 'Documentos de las áreas, sin esperas',
              icon: 'layers' as const,
              color: 'from-gloria-red-500 to-gloria-red-700',
              page: 'areas' as PageId,
            },
            {
              titulo: firmaGuardada ? 'Mi firma lista' : 'Crear mi firma',
              desc: firmaGuardada ? 'Ya puedes firmar documentos' : 'Dibújala una vez y reutilízala',
              icon: 'pen' as const,
              color: 'from-brand-600 to-brand-900',
              page: 'firma' as PageId,
            },
          ].map((a) => (
            <button
              key={a.titulo}
              type="button"
              onClick={() => onNavigate(a.page)}
              className="surface-card group flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${a.color} text-white`}>
                <Icon name={a.icon} className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-[13px] font-bold text-ink">{a.titulo}</span>
                <span className="mt-0.5 block text-[11px] text-muted">{a.desc}</span>
              </span>
              <Icon name="arrowRight" className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
