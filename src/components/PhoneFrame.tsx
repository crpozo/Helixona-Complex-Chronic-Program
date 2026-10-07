import type { ReactNode } from 'react'

/** Patient routes render inside a phone frame on desktop; full-bleed on real phones. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-6 md:py-8">
      <div className="relative w-full max-w-[420px] md:rounded-[2.6rem] md:border-[10px] md:border-sand-900 md:bg-sand-900 md:shadow-2xl">
        <div className="hidden md:block absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-sand-900" />
        <div className="phone-scroll relative flex h-[min(860px,calc(100vh-120px))] min-h-[640px] flex-col overflow-y-auto bg-sand-50 md:rounded-[2rem]">
          {children}
        </div>
      </div>
    </div>
  )
}

export function PatientTopBar({ title, back, right }: { title?: string; back?: ReactNode; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-sand-50/95 px-4 pt-7 pb-3 backdrop-blur md:pt-9">
      <div className="min-w-[48px]">{back}</div>
      <div className="truncate text-sm font-semibold text-sand-800">{title}</div>
      <div className="min-w-[48px] text-right">{right}</div>
    </div>
  )
}

/** Helixona wordmark: letterspaced caps with the outlined gold X (recreated from the brand logo). */
export function Wordmark({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const h = size === 'lg' ? 34 : size === 'sm' ? 18 : 24
  const font = size === 'lg' ? 'text-[24px]' : size === 'sm' ? 'text-[13px]' : 'text-[17px]'
  return (
    <span className={`inline-flex items-center font-sans font-normal uppercase tracking-[0.42em] ${font} ${light ? 'text-white' : 'text-sand-900'}`} aria-label="Helixona">
      HELI
      <svg viewBox="0 0 100 100" style={{ height: h * 1.55, width: h * 1.55, margin: `0 -${h * 0.1}px 0 -${h * 0.22}px` }} aria-hidden>
        <path d="M30 26 L45 50 L30 74 L41 74 L50.5 59 L60 74 L71 74 L56 50 L71 26 L60 26 L50.5 41 L41 26 Z" fill="none" stroke="#D4B77A" strokeWidth="3.2" strokeLinejoin="miter" />
        <path d="M24 6 L50.5 50 M50.5 50 L77 94" stroke="#D4B77A" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
      </svg>
      ONA
    </span>
  )
}
