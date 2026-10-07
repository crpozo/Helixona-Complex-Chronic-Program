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

export function Wordmark({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const px = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  return (
    <span className={`inline-flex items-center gap-2 ${light ? 'text-white' : 'text-teal-800'}`}>
      <svg viewBox="0 0 32 32" className={size === 'lg' ? 'h-9 w-9' : size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} aria-hidden>
        <rect width="32" height="32" rx="8" fill="#0F6E6A" />
        <path d="M10 8c0 6 12 10 12 16M22 8c0 6-12 10-12 16" stroke="#E9F3F2" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M12 12h8M12 20h8" stroke="#E9F3F2" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      </svg>
      <span className={`font-display ${px} font-semibold tracking-tight`}>helixona</span>
    </span>
  )
}
