import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { CamionStatus, FirmaStatus, IconName, StepStatus, ToastItem } from '../types'
import { Icon } from './Icon'

type ChipStatus = FirmaStatus | CamionStatus | StepStatus

const chipStyles: Record<ChipStatus, { label: string; icon: IconName; cls: string }> = {
  pendiente: {
    label: 'Pendiente',
    icon: 'clock',
    cls: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  },
  rechazado: {
    label: 'Rechazado',
    icon: 'xCircle',
    cls: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  },
  listo: {
    label: 'Listo',
    icon: 'checkDouble',
    cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  },
  en_espera: {
    label: 'En espera',
    icon: 'clock',
    cls: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
  },
  en_revision: {
    label: 'En revisión',
    icon: 'refresh',
    cls: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  },
  autorizado: {
    label: 'Autorizado',
    icon: 'checkDouble',
    cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  },
}

export function StatusChip({
  estado,
  className = '',
}: {
  estado: ChipStatus
  className?: string
}) {
  const style = chipStyles[estado]
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-bold ${style.cls} ${className}`}
    >
      <Icon name={style.icon} className="h-3.5 w-3.5" strokeWidth={2.2} />
      {style.label}
    </span>
  )
}

export function StepDot({ estado }: { estado: StepStatus }) {
  const color =
    estado === 'listo'
      ? 'bg-emerald-500 text-white'
      : estado === 'rechazado'
        ? 'bg-rose-500 text-white'
        : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color}`}>
      <Icon
        name={estado === 'listo' ? 'check' : estado === 'rechazado' ? 'x' : 'clock'}
        className="h-3.5 w-3.5"
        strokeWidth={2.6}
      />
    </span>
  )
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: string
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#081c33]/50 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`fade-up flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-[26px] bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-[26px] ${maxWidth}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-line px-5 py-5 sm:px-7">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={icon as never} className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold text-ink sm:text-xl">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted sm:text-[13px]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-ink"
            aria-label="Cerrar"
          >
            <Icon name="x" className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-line bg-slate-50/70 px-5 py-4 sm:px-7">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2.5">
      {toasts.map((toast) => {
        const tone =
          toast.tipo === 'exito'
            ? { bg: 'bg-emerald-500', icon: 'check' as const }
            : toast.tipo === 'error'
              ? { bg: 'bg-rose-500', icon: 'x' as const }
              : { bg: 'bg-brand-600', icon: 'info' as const }
        return (
          <div
            key={toast.id}
            className="toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-xl shadow-slate-900/10"
          >
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${tone.bg}`}>
              <Icon name={tone.icon} className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-ink">{toast.titulo}</p>
              {toast.detalle && <p className="mt-0.5 text-xs leading-relaxed text-muted">{toast.detalle}</p>}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-300 transition hover:text-ink"
              aria-label="Cerrar notificación"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted">{description}</p>
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  )
}

export function Avatar({ nombre, size = 'md' }: { nombre: string; size?: 'sm' | 'md' }) {
  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-bold text-white ${
        size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs'
      }`}
    >
      {iniciales}
    </span>
  )
}
