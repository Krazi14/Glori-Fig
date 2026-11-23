import type { ReactNode } from 'react'
import type { IconName } from '../types'

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-7.5 9 7.5" />
      <path d="M5.5 9.8V20h13V9.8M10 20v-6h4v6" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6.5h11v10H3z" />
      <path d="M14 9.5h4l3 3.2v3.8h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.6 3.4a2.1 2.1 0 0 1 3 3L8.5 17.5 4 19l1.5-4.5Z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16 9" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 7-2.5 8.5h17C20.5 15.5 18 15 18 8.5Z" />
      <path d="M10 20.5h4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  x: <path d="M6 6 18 18M18 6 6 18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.5 2.8 7.7 7 9.5 4.2-1.8 7-5 7-9.5V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  droplet: <path d="M12 3.5S6.5 10 6.5 14a5.5 5.5 0 0 0 11 0C17.5 10 12 3.5 12 3.5Z" />,
  thermometer: (
    <>
      <path d="M14 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0Z" />
      <path d="M12 9v7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17.5 20a5.5 5.5 0 0 0-2-4.3" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M10 4h4M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />
    </>
  ),
  undo: (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h9a7 7 0 0 1 0 14H8" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6.5 5.5 12 5.5 21.5 12 21.5 12 17.5 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19Z" />
      <path d="M12 10v4M12 17.5h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  download: <path d="M12 3.5v12m-4-4 4 4 4-4M4 20h16" />,
  building: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  send: (
    <>
      <path d="M21 3 3.5 10.2l7.2 3 3 7.3Z" />
      <path d="M10.7 13.2 21 3" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7.5A8.5 8.5 0 0 0 5.5 5L3 7.5M3 3.5v4h4" />
      <path d="M4 16.5A8.5 8.5 0 0 0 18.5 19L21 16.5M21 20.5v-4h-4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2.5" />
      <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h4" />
    </>
  ),
  milk: (
    <>
      <path d="M9 3h6v3l2 3.2V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.2L9 6Z" />
      <path d="M7 12.5h10" />
    </>
  ),
  checkDouble: (
    <>
      <path d="m2.5 12.5 4 4 8-9" />
      <path d="m10 16.5 2 2 9-11" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.6 3.4a2.1 2.1 0 0 1 3 3L8.5 17.5 4 19l1.5-4.5Z" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 20.5h-4a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h4" />
      <path d="M16 16.5 20.5 12 16 7.5M20.5 12H9" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1 .8-1.7 1.3-1.7 2.7M12 17h.01" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V3.5h10V9M7 18H5a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2" />
      <path d="M7 15h10v5.5H7z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" />
    </>
  ),
}

interface IconProps {
  name: IconName
  className?: string
  strokeWidth?: number
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export function GloriaMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lg shadow-brand-700/25`}
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M16 3.5c3.8 5 7.2 9.6 7.2 13.6A7.2 7.2 0 1 1 8.8 17.1C8.8 13.1 12.2 8.5 16 3.5Z"
          fill="white"
          fillOpacity="0.97"
        />
        <path
          d="m12.4 17.4 2.5 2.5 5.1-5.6"
          stroke="#e2231a"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
