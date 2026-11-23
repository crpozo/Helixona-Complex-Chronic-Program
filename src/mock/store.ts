import { useSyncExternalStore } from 'react'
import type { Inquiry, Role } from './types'
import { inquiries as seedInquiries } from './inquiries'

/* In-memory state shared across screens so the mockup behaves like one product:
   notes, status changes and the confirmation toast. Nothing is persisted except per-user view preferences. */

const people: Record<Role, string> = { patient: 'Marisol A.', advisor: 'Ana', karina: 'Karina', charlene: 'Charlene', nursing: 'Nursing', physician: 'Provider', admin: 'Cassandra' }
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
/** The PPO plans the clinic accepts (list supplied by the patient advisor, Nov 19, 2026). */
export const insurancePlans = ['Anthem', 'Medicare', 'Medicare w/ BC PPO', 'Medicare w/ BS PPO', 'Medicare w/ UH PPO', 'BlueCross BlueShield', 'Blue Shield-Platinum', 'Blue Shield-Gold', 'Blue Shield-Silver', 'Blue Shield-Bronze', 'Blue Shield', 'Cov Cal-BS-Silver', 'Cov Cal-BS-Gold', 'Cov Cal-BS-Platinum', 'Cov Cal-BS', 'Cigna PPO', 'United Healthcare PPO']
const sampleInsurance = ['Blue Shield-Gold', 'Cash', 'Anthem', 'Cigna PPO', 'Cash', 'Medicare w/ BS PPO', 'United Healthcare PPO', 'Cov Cal-BS-Silver']
const num = (i: { id: string }) => Number(i.id.replace(/\D/g, ''))
export const insuranceOf = (i: { id: string; insurance?: string }) => i.insurance ?? sampleInsurance[num(i) % sampleInsurance.length]
const samplePriority = ['High', '', 'Mid', 'Low', 'High', 'Mid']
export const priorityOf = (i: { id: string; priority?: string }) => i.priority ?? samplePriority[num(i) % samplePriority.length]
const n = (i: { id: string }) => Number(i.id.replace(/\D/g, ''))
/** Age and preferred name for an inquiry (sample values until the inquiry form supplies them). */
export const inquiryAge = (i: { id: string }) => 28 + (n(i) * 7) % 41
const nicknames: Record<string, string> = { Robert: 'Rob', Thomas: 'Tom', Jordan: 'Jordy', Hannah: 'Hanna', Grace: 'Gracie' }
export const preferredName = (i: { id: string; name: string }) => (n(i) % 3 === 0 ? undefined : nicknames[i.name.split(' ')[0]])

/* ---------------- Interview scheduling ----------------
 * The advisor sets weekly windows; the person picks a time from a link. Times already taken in the advisor's
 * Google Calendar or by another interview are not offered. */
export interface InterviewWindow { id: string; day: number; from: string; to: string }
export interface Interview { date: string; time: string; bookedBy: 'person' | 'advisor'; when: string }
export const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let windows: InterviewWindow[] = [
  { id: 'w1', day: 1, from: '09:00', to: '12:00' }, { id: 'w2', day: 2, from: '13:00', to: '16:00' },
  { id: 'w3', day: 3, from: '09:00', to: '12:00' }, { id: 'w4', day: 4, from: '13:00', to: '16:00' }, { id: 'w5', day: 5, from: '09:00', to: '11:00' },
]
let slotMinutes = 30
let googleConnected = true
/** Events read from the advisor's Google Calendar (sample). Only busy or free is used, never the title. */
export const googleBusy = [
  { date: '2026-10-12', from: '10:00', to: '11:00', title: 'Team huddle' }, { date: '2026-10-13', from: '14:00', to: '15:00', title: 'Admission review' },
  { date: '2026-10-14', from: '09:00', to: '09:30', title: 'Dentist' }, { date: '2026-10-16', from: '09:30', to: '10:30', title: 'Admission review' },
]
const interviews: Record<string, Interview> = { 'INQ-2207': { date: '2026-10-13', time: '13:30', bookedBy: 'person', when: 'Oct 6, 2026 · 4:12 PM' } }
const linksSent: Record<string, string> = { 'INQ-2207': 'Oct 6, 2026 · 2:05 PM' }
const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
export const fmtTime = (t: string) => { const m = mins(t); const h = Math.floor(m / 60); return `${h % 12 || 12}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
export const fmtDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
export const interviewWindows = () => windows
export const interviewSlotMinutes = () => slotMinutes
export const isGoogleConnected = () => googleConnected
export function setGoogleConnected(v: boolean) { googleConnected = v; emit() }
export function setSlotMinutes(n: number) { slotMinutes = n; emit() }
export function addWindow(w: Omit<InterviewWindow, 'id'>) { windows = [...windows, { ...w, id: `w${Date.now()}` }]; emit() }
export function removeWindow(id: string) { windows = windows.filter((w) => w.id !== id); emit() }
/** The next two weeks of weekdays, starting the Monday after the sample "today" (Oct 9, 2026). */
export const interviewDays = () => Array.from({ length: 14 }, (_, k) => { const d = new Date(Date.UTC(2026, 9, 12 + k, 12)); return d.toISOString().slice(0, 10) }).filter((iso) => { const wd = new Date(iso + 'T12:00:00').getDay(); return wd > 0 && wd < 6 })
export function slotsFor(iso: string, exceptInquiry?: string): string[] {
  const wd = new Date(iso + 'T12:00:00').getDay()
  const taken = [...(googleConnected ? googleBusy.filter((b) => b.date === iso).map((b) => [mins(b.from), mins(b.to)]) : []), ...Object.entries(interviews).filter(([k, v]) => v.date === iso && k !== exceptInquiry).map(([, v]) => [mins(v.time), mins(v.time) + slotMinutes])]
  const out: string[] = []
  for (const w of windows.filter((x) => x.day === wd)) for (let m = mins(w.from); m + slotMinutes <= mins(w.to); m += slotMinutes) if (!taken.some(([a, b]) => m < b && m + slotMinutes > a)) out.push(hhmm(m))
  return [...new Set(out)].sort()
}
export const interviewOf = (inquiryId: string): Interview | undefined => interviews[inquiryId]
export const allInterviews = () => Object.entries(interviews).map(([inquiryId, v]) => ({ inquiryId, ...v })).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
export const interviewLinkSent = (inquiryId: string): string | undefined => linksSent[inquiryId]
export function sendInterviewLink(inquiryId: string) { linksSent[inquiryId] = nowStamp(); emit() }
export function bookInterview(inquiryId: string, date: string, time: string, bookedBy: Interview['bookedBy'] = 'person') {
  interviews[inquiryId] = { date, time, bookedBy, when: nowStamp() }
  patchInquiry(inquiryId, { status: 'Interview scheduled' })
}

/* ---------------- Inquiry communication notes and reminders ---------------- */
export interface InquiryNote { id: string; inquiryId: string; kind: string; text: string; status: string; author: string; when: string }
export interface Task { id: string; title: string; due: string; about: string; link: string; owner: string; done: boolean; created: string }
export const noteKinds = ['Call', 'Email', 'Text message', 'In person', 'Note']
let inquiryNotes: InquiryNote[] = [
  { id: 'IN-2', inquiryId: 'INQ-2210', kind: 'Email', text: 'Sent the greeting email and the list of documents we need.', status: 'Lead received', author: 'Ana', when: 'Oct 7, 2026 · 9:15 AM' },
  { id: 'IN-1', inquiryId: 'INQ-2210', kind: 'Call', text: 'Called, no answer. Left a voicemail with the office number.', status: 'Lead received', author: 'Ana', when: 'Oct 7, 2026 · 8:40 AM' },
]
let tasks: Task[] = [
  { id: 'T-1', title: 'Call back about the insurance plan document', due: '2026-10-12', about: 'Hannah Bergström', link: '/staff/inquiries/INQ-2210', owner: 'Ana', done: false, created: 'Oct 7, 2026 · 9:16 AM' },
  { id: 'T-2', title: 'Confirm interview time by text', due: '2026-10-10', about: 'Jordan Blake', link: '/staff/inquiries/INQ-2207', owner: 'Ana', done: false, created: 'Oct 6, 2026 · 4:20 PM' },
]
export const notesForInquiry = (id: string) => inquiryNotes.filter((x) => x.inquiryId === id)
export function addInquiryNote(note: Omit<InquiryNote, 'id' | 'author' | 'when'>) { inquiryNotes = [{ ...note, id: `IN-${Date.now()}`, author: currentUser().name, when: nowStamp() }, ...inquiryNotes]; emit() }
export const allTasks = () => tasks
export function addTask(t: Omit<Task, 'id' | 'done' | 'created' | 'owner'>) { tasks = [{ ...t, id: `T-${Date.now()}`, done: false, owner: currentUser().name, created: nowStamp() }, ...tasks]; emit() }
export function patchTask(id: string, p: Partial<Task>) { tasks = tasks.map((t) => (t.id === id ? { ...t, ...p } : t)); emit() }
export function removeTask(id: string) { tasks = tasks.filter((t) => t.id !== id); emit() }
