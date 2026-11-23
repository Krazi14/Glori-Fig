import { useState } from 'react'
import type { PageId } from '../types'
import { pageMeta } from '../data/pageMeta'
import { GloriaMark, Icon } from './Icon'
import { Avatar } from './ui'

export function Sidebar({
  page,
  onNavigate,
  open,
  onClose,
  pendientesFirmas,
  pendientesCamiones,
}: {
  page: PageId
  onNavigate: (page: PageId) => void
  open: boolean
  onClose: () => void
  pendientesFirmas: number
  pendientesCamiones: number
}) {
  const ir = (destino: PageId) => {
    onNavigate(destino)
    onClose()
  }

  const item = (id: PageId, label: string, icon: Parameters<typeof Icon>[0]['name'], badge?: number) => {
    const activo = page === id
    return (
      <button
        key={id}
        type="button"
        onClick={() => ir(id)}
        className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[13.5px] font-semibold transition-all ${
          activo
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
            : 'text-[#5d7188] hover:bg-brand-50 hover:text-brand-700'
        }`}
      >
        <Icon name={icon} className={`h-[19px] w-[19px] shrink-0 ${activo ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'}`} />
        <span className="flex-1 leading-tight">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span
            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10.5px] font-bold ${
              activo ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#081c33]/45 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-line bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 pb-5 pt-6">
          <GloriaMark />
          <div>
            <p className="font-display text-[17px] font-extrabold leading-none tracking-tight text-ink">
              Glori<span className="text-brand-600">Firmas</span>
            </p>
            <p className="mt-1 text-[10.5px] font-medium tracking-wide text-muted">Firmas electrónicas</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Cerrar menú"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <nav className="scroll-thin flex-1 space-y-6 overflow-y-auto px-3.5 pb-4">
          <div>
            <p className="mb-2 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Gestión
            </p>
            <div className="space-y-1">
              {item('inicio', 'Inicio', 'home')}
              {item('camiones', 'Registro de camiones', 'truck', pendientesCamiones)}
              {item('firmas', 'Centro de firmas', 'pen', pendientesFirmas)}
              {item('areas', 'Áreas internas', 'layers')}
            </div>
          </div>
          <div>
            <p className="mb-2 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Mi espacio
            </p>
            <div className="space-y-1">{item('firma', 'Mi firma digital', 'badge')}</div>
          </div>
        </nav>

        <div className="px-3.5 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white">
            <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 right-8 h-20 w-20 rounded-full bg-gloria-red-500/40" />
            <Icon name="sparkles" className="h-5 w-5 text-brand-200" />
            <p className="relative mt-2 font-display text-[13px] font-bold">Todo en un solo lugar</p>
            <p className="relative mt-1 text-[11px] leading-relaxed text-brand-100">
              Firmar ya no detiene a los camiones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-5 py-4">
          <Avatar nombre="María Rojas" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-ink">María Rojas</p>
            <p className="truncate text-[10.5px] text-muted">Coordinación de Calidad</p>
          </div>
          <Icon name="logout" className="h-4 w-4 text-slate-300" />
        </div>
      </aside>
    </>
  )
}

export function Topbar({
  page,
  onMenu,
  onSearch,
  pendientesFirmas,
  onIrFirmas,
}: {
  page: PageId
  onMenu: () => void
  onSearch: (query: string) => void
  pendientesFirmas: number
  onIrFirmas: () => void
}) {
  const [busqueda, setBusqueda] = useState('')
  const [notificaciones, setNotificaciones] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[#f4f8fc]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 py-3.5 sm:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink shadow-sm lg:hidden"
          aria-label="Abrir menú"
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-extrabold text-ink sm:text-[17px]">
            {pageMeta[page].title}
          </p>
          <p className="hidden truncate text-[11.5px] text-muted sm:block">{pageMeta[page].subtitle}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSearch(busqueda)
          }}
          className="relative hidden xl:block"
        >
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar firma, placa o código..."
            className="h-10 w-[290px] rounded-xl border border-line bg-white pl-10 pr-3 text-[12.5px] outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
          />
        </form>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificaciones((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-[#556d85] shadow-sm transition hover:text-brand-600"
            aria-label="Notificaciones"
          >
            <Icon name="bell" className="h-[18px] w-[18px]" />
            {pendientesFirmas > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
          {notificaciones && (
            <div className="fade-up absolute right-0 top-12 w-[310px] rounded-2xl border border-line bg-white p-2 shadow-xl">
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Notificaciones
              </p>
              <button
                type="button"
                onClick={() => {
                  onIrFirmas()
                  setNotificaciones(false)
                }}
                className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-brand-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Icon name="clock" className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[12.5px] font-bold text-ink">
                    {pendientesFirmas} firmas esperando tu revisión
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    Haz clic para ver el centro de firmas
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="hidden h-9 w-px bg-line md:block" />
        <div className="hidden items-center gap-2.5 md:flex">
          <Avatar nombre="María Rojas" />
          <div className="leading-tight">
            <p className="text-[12.5px] font-bold text-ink">María Rojas</p>
            <p className="text-[10.5px] text-muted">Calidad</p>
          </div>
        </div>
      </div>
    </header>
  )
}
