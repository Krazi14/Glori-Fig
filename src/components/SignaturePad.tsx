import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Icon } from './Icon'

const colores = [
  { valor: '#0b3b78', nombre: 'Azul marino' },
  { valor: '#0b57ad', nombre: 'Azul Gloria' },
  { valor: '#0f172a', nombre: 'Negro' },
  { valor: '#e2231a', nombre: 'Rojo Gloria' },
]

const fuentes = [
  { valor: 'Dancing Script', etiqueta: 'Manuscrita' },
  { valor: 'Brush Script MT', etiqueta: 'Pincel' },
  { valor: 'Inter', etiqueta: 'Moderna' },
]

export function SignaturePad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const [modo, setModo] = useState<'dibujar' | 'escribir'>('dibujar')
  const [color, setColor] = useState('#0b3b78')
  const [grosor, setGrosor] = useState(2.8)
  const [texto, setTexto] = useState('María Rojas')
  const [fuente, setFuente] = useState('Dancing Script')
  const [hayTrazo, setHayTrazo] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dibujando = useRef(false)

  useEffect(() => {
    if (modo !== 'dibujar') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ancho = canvas.clientWidth
    const alto = canvas.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = ancho * dpr
    canvas.height = alto * dpr
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [modo])

  const punto = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const iniciar = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dibujando.current = true
    const p = punto(e)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x + 0.01, p.y + 0.01)
    ctx.strokeStyle = color
    ctx.lineWidth = grosor
    ctx.stroke()
    setHayTrazo(true)
  }

  const mover = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const p = punto(e)
    ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = color
    ctx.lineWidth = grosor
    ctx.stroke()
  }

  const terminar = () => {
    dibujando.current = false
  }

  const limpiar = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    setHayTrazo(false)
  }

  const guardar = async () => {
    if (modo === 'dibujar') {
      if (!hayTrazo) return
      const data = canvasRef.current?.toDataURL('image/png')
      if (data) onSave(data)
      return
    }
    if (!texto.trim()) return
    await document.fonts.ready
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 280
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const esManuscrita = fuente !== 'Inter'
    ctx.font = `${esManuscrita ? 700 : 600} ${esManuscrita ? 118 : 84}px "${fuente}", cursive`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(texto.trim(), 500, 150)
    onSave(canvas.toDataURL('image/png'))
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon name="pen" className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="font-display text-[15px] font-bold text-ink">Crea tu firma</h2>
            <p className="text-[11.5px] text-muted">Elige dibujarla o escribir tu nombre</p>
          </div>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1">
          {(['dibujar', 'escribir'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold capitalize transition ${
                modo === m ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-ink'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {modo === 'dibujar' ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)]">
            {!hayTrazo && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-300">
                <Icon name="edit" className="h-7 w-7" />
                <p className="font-script text-2xl">Firma aquí</p>
                <p className="text-[11px]">Usa el mouse, el dedo o un lápiz óptico</p>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="canvas-pad block h-[230px] w-full"
              onPointerDown={iniciar}
              onPointerMove={mover}
              onPointerUp={terminar}
              onPointerCancel={terminar}
            />
            <div className="mx-8 border-b border-slate-200" />
            <p className="py-2 text-center text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Firma del responsable
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="field-label" htmlFor="nombre-firma">
                Escribe tu nombre completo
              </label>
              <input
                id="nombre-firma"
                className="field"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Tu nombre y apellido"
              />
            </div>
            <div>
              <p className="field-label">Estilo de firma</p>
              <div className="flex flex-wrap gap-2">
                {fuentes.map((f) => (
                  <button
                    key={f.valor}
                    type="button"
                    onClick={() => setFuente(f.valor)}
                    className={`rounded-xl border px-3 py-2 text-[12px] font-semibold transition ${
                      fuente === f.valor
                        ? 'border-brand-400 bg-brand-50 text-brand-700'
                        : 'border-line bg-white text-slate-500 hover:border-brand-200'
                    }`}
                  >
                    {f.etiqueta}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-white px-6">
              <span
                className="max-w-full truncate text-[#0b3b78]"
                style={{ fontFamily: `"${fuente}", cursive`, fontSize: fuente === 'Inter' ? 52 : 68 }}
              >
                {texto || 'Tu firma aparecerá aquí'}
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div>
            <p className="field-label mb-2">Color de tinta</p>
            <div className="flex gap-2">
              {colores.map((c) => (
                <button
                  key={c.valor}
                  type="button"
                  title={c.nombre}
                  onClick={() => setColor(c.valor)}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    color === c.valor ? 'scale-110 border-white ring-2 ring-brand-500' : 'border-white ring-1 ring-slate-200'
                  }`}
                  style={{ background: c.valor }}
                  aria-label={c.nombre}
                />
              ))}
            </div>
          </div>
          {modo === 'dibujar' && (
            <div className="min-w-[160px] flex-1">
              <label className="field-label" htmlFor="grosor">
                Grosor del trazo · {grosor.toFixed(1)} px
              </label>
              <input
                id="grosor"
                type="range"
                min="1"
                max="6"
                step="0.2"
                value={grosor}
                onChange={(e) => setGrosor(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-line pt-5">
          <button type="button" onClick={() => void guardar()} className="btn btn-primary" disabled={modo === 'dibujar' && !hayTrazo}>
            <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
            Guardar mi firma
          </button>
          {modo === 'dibujar' && (
            <button type="button" onClick={limpiar} className="btn btn-outline" disabled={!hayTrazo}>
              <Icon name="undo" className="h-4 w-4" />
              Limpiar
            </button>
          )}
          <p className="ml-auto self-center text-[11px] text-muted">Se guarda solo en este navegador</p>
        </div>
      </div>
    </div>
  )
}
