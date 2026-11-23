import { useRef, useState } from 'react'
import type {
  Camion,
  Firma,
  Firmante,
  NuevoCamionInput,
  PageId,
  ToastItem,
} from './types'
import { areasIniciales, camionesIniciales, firmasIniciales } from './data/mock'
import { Sidebar, Topbar } from './components/Shell'
import { ToastStack } from './components/ui'
import { Dashboard } from './pages/Dashboard'
import { Camiones } from './pages/Camiones'
import { Firmas } from './pages/Firmas'
import { Areas } from './pages/Areas'
import { MiFirma } from './pages/MiFirma'

const horaActual = () =>
  new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })

const hoy = () =>
  new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })

function leerFirmaGuardada(): string | null {
  try {
    return localStorage.getItem('glori_firma')
  } catch {
    return null
  }
}

export default function App() {
  const [page, setPage] = useState<PageId>('inicio')
  const [camiones, setCamiones] = useState<Camion[]>(camionesIniciales)
  const [firmas, setFirmas] = useState<Firma[]>(firmasIniciales)
  const [firmaGuardada, setFirmaGuardada] = useState<string | null>(leerFirmaGuardada)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [foco, setFoco] = useState<{ id: string; key: number } | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [busquedaKey, setBusquedaKey] = useState(0)
  const contadorToast = useRef(0)

  const notify = (titulo: string, detalle: string, tipo: ToastItem['tipo'] = 'exito') => {
    const id = ++contadorToast.current
    setToasts((prev) => [...prev, { id, titulo, detalle, tipo }])
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4300)
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const navigate = (destino: PageId) => {
    setPage(destino)
    setFoco(null)
    setSidebarOpen(false)
    scrollTop()
  }

  const irAFirmas = (id?: string) => {
    setFoco(id ? { id, key: Date.now() } : null)
    setPage('firmas')
    setSidebarOpen(false)
    scrollTop()
  }

  const buscar = (query: string) => {
    setBusqueda(query.trim())
    setBusquedaKey((k) => k + 1)
    irAFirmas()
  }

  const marcarFirmantes = (firmantes: Firmante[], estado: Firmante['estado']): Firmante[] =>
    firmantes.map((f) =>
      estado === 'listo' && f.estado !== 'listo'
        ? { ...f, estado, hora: f.hora && f.hora !== '—' ? f.hora : horaActual() }
        : estado === 'rechazado' && f.estado === 'pendiente'
          ? { ...f, estado, hora: horaActual() }
          : f,
    )

  const aprobarFirma = (id: string) => {
    const firma = firmas.find((f) => f.id === id)
    if (!firma) return
    setFirmas((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, estado: 'listo', firmantes: marcarFirmantes(f.firmantes, 'listo') } : f,
      ),
    )
    if (firma.camionId) {
      setCamiones((prev) =>
        prev.map((c) => (c.id === firma.camionId ? { ...c, estado: 'autorizado' } : c)),
      )
    }
    notify('Firma aprobada', `${firma.id} quedó lista. El camión ya puede avanzar.`, 'exito')
  }

  const rechazarFirma = (id: string, motivo: string) => {
    const firma = firmas.find((f) => f.id === id)
    if (!firma) return
    setFirmas((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, estado: 'rechazado', motivoRechazo: motivo, firmantes: marcarFirmantes(f.firmantes, 'rechazado') }
          : f,
      ),
    )
    if (firma.camionId) {
      setCamiones((prev) =>
        prev.map((c) => (c.id === firma.camionId ? { ...c, estado: 'rechazado' } : c)),
      )
    }
    notify('Firma rechazada', `${firma.id} volvió a revisión con el motivo registrado.`, 'error')
  }

  const nuevoCamion = (datos: NuevoCamionInput) => {
    const siguienteCamion = Math.max(...camiones.map((c) => Number(c.id.split('-')[2]) || 0)) + 1
    const siguienteFirma = Math.max(...firmas.map((f) => Number(f.id.split('-')[2]) || 0)) + 1
    const camionId = `CAM-2026-${String(siguienteCamion).padStart(4, '0')}`
    const firmaId = `FIR-2026-${String(siguienteFirma).padStart(4, '0')}`
    const hora = horaActual()

    const camion: Camion = {
      id: camionId,
      placa: datos.placa,
      conductor: datos.conductor,
      origen: datos.origen,
      destino: 'Planta Gloria · Chiclayo',
      litros: datos.litros,
      temperatura: datos.temperatura,
      llegada: hora,
      estado: 'en_espera',
      firmaId,
      area: datos.area,
      cisterna: `Cisterna ${String(camiones.length + 1).padStart(2, '0')}`,
    }

    const firmantes: Firmante[] = [
      { area: 'Recepción', nombre: 'M. Rojas', estado: 'listo', hora },
      { area: 'Calidad', nombre: 'Ing. P. Vargas', estado: 'pendiente', hora: '—' },
      { area: 'Producción', nombre: 'L. Campos', estado: 'pendiente', hora: '—' },
      { area: 'Almacén y despacho', nombre: 'J. Alva', estado: 'pendiente', hora: '—' },
    ]

    const firma: Firma = {
      id: firmaId,
      scope: 'camion',
      titulo: 'Autorización de descarga de leche',
      documento: `Guía de remisión · GR-${String(siguienteCamion).padStart(4, '0')}`,
      area: datos.area,
      solicitante: 'Recepción de leche',
      fecha: `Hoy, ${hoy()}`,
      hora,
      estado: 'pendiente',
      descripcion: `Validación de ${datos.litros.toLocaleString('es-PE')} L de leche del camión ${datos.placa}.`,
      camionId,
      firmantes,
    }

    setCamiones((prev) => [camion, ...prev])
    setFirmas((prev) => [firma, ...prev])
    notify('Camión registrado', `${datos.placa} quedó vinculado a la firma ${firmaId}.`, 'exito')
  }

  const solicitarFirma = (datos: { area: string; titulo: string; documento: string; descripcion: string }) => {
    const siguiente = Math.max(...firmas.map((f) => Number(f.id.split('-')[2]) || 0)) + 1
    const id = `FIR-2026-${String(siguiente).padStart(4, '0')}`
    const firma: Firma = {
      id,
      scope: 'area',
      titulo: datos.titulo,
      documento: datos.documento,
      area: datos.area,
      solicitante: 'María Rojas',
      fecha: `Hoy, ${hoy()}`,
      hora: horaActual(),
      estado: 'pendiente',
      descripcion: datos.descripcion,
      firmantes: [
        { area: datos.area, nombre: 'Responsable del área', estado: 'pendiente', hora: '—' },
        { area: 'Gerencia', nombre: 'M. Rojas', estado: 'pendiente', hora: '—' },
      ],
    }
    setFirmas((prev) => [firma, ...prev])
    notify('Solicitud enviada', `${id} ya aparece en el centro de firmas.`, 'exito')
  }

  const guardarFirma = (dataUrl: string) => {
    setFirmaGuardada(dataUrl)
    try {
      localStorage.setItem('glori_firma', dataUrl)
    } catch {
      /* almacenamiento no disponible */
    }
    notify('Firma guardada', 'Ya puedes usarla en los documentos y autorizaciones.', 'exito')
  }

  const eliminarFirma = () => {
    setFirmaGuardada(null)
    try {
      localStorage.removeItem('glori_firma')
    } catch {
      /* almacenamiento no disponible */
    }
    notify('Firma eliminada', 'Puedes crear una nueva cuando quieras.', 'info')
  }

  const pendientesFirmas = firmas.filter((f) => f.estado === 'pendiente').length
  const pendientesCamiones = camiones.filter(
    (c) => c.estado === 'en_espera' || c.estado === 'en_revision',
  ).length

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Sidebar
        page={page}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendientesFirmas={pendientesFirmas}
        pendientesCamiones={pendientesCamiones}
      />

      <div className="lg:pl-[268px]">
        <Topbar
          page={page}
          onMenu={() => setSidebarOpen(true)}
          onSearch={buscar}
          pendientesFirmas={pendientesFirmas}
          onIrFirmas={() => irAFirmas()}
        />

        <main className="mx-auto max-w-[1440px] px-5 pb-14 pt-6 sm:px-8 sm:pt-8">
          {page === 'inicio' && (
            <Dashboard
              camiones={camiones}
              firmas={firmas}
              areas={areasIniciales}
              firmaGuardada={firmaGuardada}
              onNavigate={navigate}
              onVerFirma={irAFirmas}
            />
          )}
          {page === 'camiones' && (
            <Camiones
              camiones={camiones}
              firmas={firmas}
              onNuevo={nuevoCamion}
              onVerFirma={irAFirmas}
            />
          )}
          {page === 'firmas' && (
            <Firmas
              key={`${busquedaKey}-${foco?.key ?? 0}`}
              firmas={firmas}
              camiones={camiones}
              firmaGuardada={firmaGuardada}
              busquedaInicial={busqueda}
              foco={foco}
              onAprobar={aprobarFirma}
              onRechazar={rechazarFirma}
            />
          )}
          {page === 'areas' && (
            <Areas
              areas={areasIniciales}
              firmas={firmas}
              onSolicitar={solicitarFirma}
              onVerFirmasArea={(area) => buscar(area)}
              onIrMiFirma={() => navigate('firma')}
            />
          )}
          {page === 'firma' && (
            <MiFirma
              firmaGuardada={firmaGuardada}
              firmas={firmas}
              onGuardar={guardarFirma}
              onEliminar={eliminarFirma}
            />
          )}
        </main>

        <footer className="border-t border-line px-5 py-5 text-center text-[11px] text-muted sm:px-8">
          GloriFirmas · Gestión de firmas electrónicas · Demo frontend
        </footer>
      </div>

      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  )
}
