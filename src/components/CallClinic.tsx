import { Phone } from 'lucide-react'

/** Office hours: Monday to Friday, 8 AM to 5 PM Pacific. */
export function officeOpen(now = new Date()): boolean {
  const p = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  return p.getDay() >= 1 && p.getDay() <= 5 && p.getHours() >= 8 && p.getHours() < 17
}
export const CLINIC_PHONE = '(949) 257-2644'

/** One tap to call the clinic. Active only during office hours; outside them it is greyed out and says so. */
export function CallClinic({ label = 'Call the clinic', className = '' }: { label?: string; className?: string }) {
  const open = officeOpen()
  return (
    <div className={className}>
      {open
        ? <a href="tel:+19492572644" className="btn-secondary btn-lg w-full"><Phone size={17} /> {label}</a>
        : <button type="button" disabled aria-disabled className="btn-secondary btn-lg w-full cursor-not-allowed border-sand-300 bg-sand-100 text-sand-400 opacity-100"><Phone size={17} /> {label}</button>}
      <p className="mt-1 text-center text-xs text-sand-500">{open ? `Open now · ${CLINIC_PHONE} · Mon–Fri, 8 AM–5 PM` : 'The office is currently closed. Open Mon–Fri, 8 AM–5 PM. For a medical emergency, call 911.'}</p>
    </div>
  )
}
