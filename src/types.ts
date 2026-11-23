export type IconName =
  | 'home'
  | 'truck'
  | 'pen'
  | 'layers'
  | 'badge'
  | 'search'
  | 'bell'
  | 'menu'
  | 'chevronRight'
  | 'chevronDown'
  | 'check'
  | 'x'
  | 'clock'
  | 'plus'
  | 'filter'
  | 'arrowRight'
  | 'file'
  | 'shield'
  | 'droplet'
  | 'thermometer'
  | 'pin'
  | 'calendar'
  | 'users'
  | 'sparkles'
  | 'trash'
  | 'undo'
  | 'eye'
  | 'alert'
  | 'info'
  | 'download'
  | 'building'
  | 'xCircle'
  | 'send'
  | 'refresh'
  | 'clipboard'
  | 'milk'
  | 'checkDouble'
  | 'edit'
  | 'logout'
  | 'help'
  | 'print'
  | 'lock'

export type PageId = 'inicio' | 'camiones' | 'firmas' | 'areas' | 'firma'

export type StepStatus = 'listo' | 'pendiente' | 'rechazado'
export type FirmaStatus = 'pendiente' | 'rechazado' | 'listo'
export type FirmaScope = 'camion' | 'area'
export type CamionStatus = 'en_espera' | 'en_revision' | 'autorizado' | 'rechazado'

export interface Firmante {
  area: string
  nombre: string
  estado: StepStatus
  hora?: string
}

export interface Firma {
  id: string
  scope: FirmaScope
  titulo: string
  documento: string
  area: string
  solicitante: string
  fecha: string
  hora: string
  estado: FirmaStatus
  descripcion: string
  firmantes: Firmante[]
  camionId?: string
  motivoRechazo?: string
}

export interface Camion {
  id: string
  placa: string
  conductor: string
  origen: string
  destino: string
  litros: number
  temperatura: number
  llegada: string
  estado: CamionStatus
  firmaId: string
  area: string
  cisterna: string
}

export interface NuevoCamionInput {
  placa: string
  conductor: string
  origen: string
  litros: number
  temperatura: number
  area: string
}

export interface AreaInterna {
  id: string
  nombre: string
  responsable: string
  descripcion: string
  pendientes: number
  promedio: string
  color: string
  icon: IconName
}

export interface ToastItem {
  id: number
  titulo: string
  detalle?: string
  tipo: 'exito' | 'error' | 'info'
}
