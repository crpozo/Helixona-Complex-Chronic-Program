import { useSyncExternalStore } from 'react'
import type { Inquiry, Role } from './types'
import { inquiries as seedInquiries } from './inquiries'

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
  { id: 'N-09', patientId: 'P-0044', category: 'Billing', text: 'A&P fee paid by card. Receipt sent.', author: 'Karina', when: 'Oct 2, 2026 · 4:10 PM', ts: 9 },
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

/* ---------------- Status order ---------------- */
/** Every status in the order a person moves through it. Dropdowns and filters list statuses in this order. */
export const journeyOrder = ['Inquiry received', 'Advisor outreach', 'Advisor interview completed', 'Insurance benefits review', 'Admissions review', 'Pending information', 'Waitlist',
  'Accepted for A&P', 'A&P scheduled', 'A&P in progress', 'A&P complete', 'Program offered', 'Contract pending', 'Payment pending',
  'Active member', 'Active · 9-month program', 'Active · month-to-month program', 'Temporarily paused', 'Paused', 'Month 9 review', 'Continued active care', 'Maintenance', 'Graduated',
  'Program not offered', 'Patient declined', 'Patient fell off', 'Denied', 'Withdrawn', 'Discharged']
export const inJourneyOrder = (list: string[]) => [...new Set(list)].sort((a, b) => { const i = journeyOrder.indexOf(a), j = journeyOrder.indexOf(b); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j) })
/** An inquiry that is accepted is added to the patient list. Patient statuses start at Pending information / Accepted for A&P. */
export const isPatientStatus = (status: string) => status === 'Pending information' || (journeyOrder.indexOf(status) >= journeyOrder.indexOf('Accepted for A&P') && !['Patient fell off', 'Denied'].includes(status))
/** Statuses of a website or phone inquiry, in order. Accepted moves the person to the patient list. */
export const inquiryStatuses = ['Lead received', 'Waiting for response', 'Pending information', 'Interview scheduled', 'Waiting for admission review', 'Accepted', 'Waitlisted', 'Denied'] as const

/* ---------------- Inquiries: status, owner, manual entries ---------------- */
const inquiryPatch: Record<string, Partial<Inquiry>> = {}
const addedInquiries: Inquiry[] = []
export const allInquiries = (): Inquiry[] => [...addedInquiries, ...seedInquiries].map((i) => ({ ...i, ...inquiryPatch[i.id] }))
export const inquiryById = (id: string) => allInquiries().find((i) => i.id === id)
export function patchInquiry(id: string, patch: Partial<Inquiry>) { inquiryPatch[id] = { ...inquiryPatch[id], ...patch }; emit() }
export function addInquiry(i: Omit<Inquiry, 'id' | 'receivedAt'>): string {
  const id = `INQ-${2211 + addedInquiries.length}`
  addedInquiries.unshift({ ...i, id, receivedAt: nowStamp() }); emit(); return id
}
/** The inquiry's date as YYYY-MM-DD, for period filters. */
export const inquiryDate = (i: Inquiry) => { const t = Date.parse(i.receivedAt.split(' · ')[0]); return Number.isNaN(t) ? '2026-10-09' : new Date(t).toISOString().slice(0, 10) }

/* ---------------- Patient ownership and program ---------------- */
const ownerOf: Record<string, string> = {}
export const patientOwner = (id: string, fallback: string) => ownerOf[id] ?? fallback
export function takePatient(id: string) { ownerOf[id] = currentUser().name; logEvent(id, `${currentUser().name} took ownership`) }
const programOf: Record<string, string> = {}
export const patientProgram = (id: string) => programOf[id]
export function setProgram(id: string, program: string) { programOf[id] = program; emit() }

/** Type of insurance for an inquiry (sample values until the inquiry form supplies it). */
const sampleInsurance = ['Blue Shield PPO', 'Cash', 'Aetna PPO', 'Anthem Blue Cross PPO', 'Cash', 'Cigna PPO', 'UnitedHealthcare PPO', 'Medicare']
export const insuranceOf = (i: { id: string }) => sampleInsurance[Number(i.id.replace(/\D/g, '')) % sampleInsurance.length]
const n = (i: { id: string }) => Number(i.id.replace(/\D/g, ''))
/** Age and preferred name for an inquiry (sample values until the inquiry form supplies them). */
export const inquiryAge = (i: { id: string }) => 28 + (n(i) * 7) % 41
const nicknames: Record<string, string> = { Robert: 'Rob', Thomas: 'Tom', Jordan: 'Jordy', Hannah: 'Hanna', Grace: 'Gracie' }
export const preferredName = (i: { id: string; name: string }) => (n(i) % 3 === 0 ? undefined : nicknames[i.name.split(' ')[0]])
