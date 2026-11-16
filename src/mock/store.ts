import { useSyncExternalStore } from 'react'
import type { Role } from './types'

/* In-memory state shared across screens so the mockup behaves like one product:
   notes, status changes and the confirmation toast. Nothing is persisted except per-user view preferences. */

const people: Record<Role, string> = { patient: 'Marisol A.', advisor: 'Ana', karina: 'Karina', charlene: 'Charlene', nursing: 'Nursing', physician: 'Dr. D.', admin: 'Cassandra' }
export function currentUser(): { role: Role; name: string } {
  let role: Role = 'advisor'
  try { role = (localStorage.getItem('hlx-role') as Role) || 'advisor' } catch { /* ignore */ }
  return { role, name: people[role] ?? 'Ana' }
}
export const nowStamp = () => new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/, (\d{1,2}:)/, ' · $1')

let version = 0
const listeners = new Set<() => void>()
const emit = () => { version++; listeners.forEach((l) => l()) }
/** Re-render when anything in the store changes. */
export function useStore() { return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => version) }

/* ---------------- Notes ---------------- */
export const noteCategories = ['Chart prep', 'Intake', 'Admission', 'Billing', 'Scheduling', 'General'] as const
export type NoteCategory = (typeof noteCategories)[number]
export interface Note { id: string; patientId: string; category: NoteCategory; text: string; author: string; when: string; ts: number }
let seq = 100
const notes: Note[] = [
  { id: 'N-12', patientId: 'P-0043', category: 'Intake', text: 'Texted patient about lab pages; she will re-upload this week.', author: 'Ana', when: 'Oct 1, 2026 · 9:04 AM', ts: 12 },
  { id: 'N-11', patientId: 'P-0043', category: 'Chart prep', text: 'Waiting on pages 3–4 of the Quest report before preparing the note.', author: 'Charlene', when: 'Oct 1, 2026 · 8:40 AM', ts: 11 },
  { id: 'N-10', patientId: 'P-0044', category: 'Chart prep', text: 'Intake complete. Note is ready to paste; PDF checked.', author: 'Charlene', when: 'Oct 2, 2026 · 4:30 PM', ts: 10 },
  { id: 'N-09', patientId: 'P-0044', category: 'Billing', text: 'Month 0 fee paid by card. Receipt sent.', author: 'Karina', when: 'Oct 2, 2026 · 4:10 PM', ts: 9 },
  { id: 'N-08', patientId: 'P-0041', category: 'Chart prep', text: 'Reviewed placement in eCW. Note and PDF are in the right place.', author: 'Charlene', when: 'Sep 16, 2026 · 8:30 AM', ts: 8 },
  { id: 'N-07', patientId: 'P-0041', category: 'Scheduling', text: 'Prefers Tuesday or Thursday mornings.', author: 'Ana', when: 'Sep 14, 2026 · 2:00 PM', ts: 7 },
  { id: 'N-06', patientId: 'P-0039', category: 'Chart prep', text: 'PDF did not verify after upload. Uploading by hand today.', author: 'Charlene', when: 'Oct 5, 2026 · 9:15 AM', ts: 6 },
  { id: 'N-05', patientId: 'P-0045', category: 'Intake', text: 'Called to help with the questionnaire; will finish over the weekend.', author: 'Ana', when: 'Oct 3, 2026 · 11:20 AM', ts: 5 },
  { id: 'N-04', patientId: 'P-0046', category: 'Admission', text: 'Interview done. Waiting on the insurance benefits review from Karina.', author: 'Ana', when: 'Oct 6, 2026 · 11:45 AM', ts: 4 },
  { id: 'N-03', patientId: 'P-0047', category: 'Admission', text: 'Qualified. Added to the waitlist for the next program opening.', author: 'Ana', when: 'Oct 7, 2026 · 3:10 PM', ts: 3 },
  { id: 'N-02', patientId: 'P-0048', category: 'Admission', text: 'Needs prior records from the rheumatologist before we can decide.', author: 'Ana', when: 'Oct 7, 2026 · 10:05 AM', ts: 2 },
]
export const notesFor = (patientId: string) => notes.filter((n) => n.patientId === patientId).sort((a, b) => b.ts - a.ts)
export const latestNote = (patientId: string, author?: string) => notesFor(patientId).find((n) => !author || n.author === author)
export function addNote(patientId: string, category: NoteCategory, text: string) {
  const u = currentUser()
  notes.push({ id: `N-${++seq}`, patientId, category, text: text.trim(), author: u.name, when: nowStamp(), ts: Date.now() })
  emit()
}

/* ---------------- Status changes ---------------- */
const statusOverride: Record<string, string> = {}
const extraHistory: Record<string, { actor: string; when: string; action: string; reason?: string }[]> = {}
export const statusOf = <T extends { id: string; status: string }>(p: T) => statusOverride[p.id] ?? p.status
export const addedHistory = (id: string) => extraHistory[id] ?? []
export function changeStatus(id: string, status: string, reason?: string) {
  statusOverride[id] = status
  ;(extraHistory[id] ??= []).push({ actor: currentUser().name, when: nowStamp(), action: `Status → ${status}`, reason })
  emit()
}
export function logEvent(id: string, action: string, reason?: string) {
  ;(extraHistory[id] ??= []).push({ actor: currentUser().name, when: nowStamp(), action, reason }); emit()
}

/* ---------------- Confirmation toast ---------------- */
let toast: string | null = null
let timer: ReturnType<typeof setTimeout> | undefined
export const toastMessage = () => toast
export function notify(message: string) { toast = message; emit(); clearTimeout(timer); timer = setTimeout(() => { toast = null; emit() }, 2600) }
