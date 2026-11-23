import type { PageId } from '../types'

export const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  inicio: {
    title: 'Panel general',
    subtitle: 'Un vistazo rápido a las firmas y camiones de hoy.',
  },
  camiones: {
    title: 'Registro de camiones',
    subtitle: 'Controla la llegada, la leche transportada y la autorización de cada cisterna.',
  },
  firmas: {
    title: 'Centro de firmas',
    subtitle: 'Gestiona las solicitudes pendientes, rechazadas y autorizadas.',
  },
  areas: {
    title: 'Áreas internas',
    subtitle: 'Firmas internas más rápidas, sin pasar de un escritorio a otro.',
  },
  firma: {
    title: 'Mi firma digital',
    subtitle: 'Crea y guarda tu firma para usarla en todos los documentos.',
  },
}
