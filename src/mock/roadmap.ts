/* ---------------- Healing Roadmap: the seven stages every patient moves through ----------------
   Shared by patient screens (home, booking), staff screens (patient detail, registry) and configuration
   (which stages a modality is permitted in). Wording as supplied by the clinic's Healing Roadmap graphic. */
export interface Stage { n: number; title: string; blurb: string; /** Colour of this step in the clinic's Healing Roadmap graphic. */ color: string }
export const stages: Stage[] = [
  { n: 1, title: 'What is your Why?', blurb: 'Your Why guides every step of your journey and keeps you grounded when healing gets difficult.', color: '#D2A679' },
  { n: 2, title: 'Stabilization', blurb: 'Before starting treatments we must stabilize your body so it can tolerate the deeper therapies more effectively and safely.', color: '#8B9279' },
  { n: 3, title: 'Identify Lead Actors', blurb: 'Identify the sources of your illness. Begin with the lead actor, then address other factors in order of severity.', color: '#EADFBF' },
  { n: 4, title: 'Resolve Lead Actor', blurb: 'Treat the Lead Actor first. Your doctor will know which needs to be addressed in order of importance.', color: '#BFAE9F' },
  { n: 5, title: 'Resolve Next Actors', blurb: 'After the Lead Actor is cleared, treat additional actors until all root causes are resolved.', color: '#D6CDC6' },
  { n: 6, title: 'Rewiring Resilience', blurb: 'Rebalance the nervous system and reinforce resilience for lasting stability.', color: '#6B4226' },
  { n: 7, title: 'Graduate to Maintenance & Longevity', blurb: 'Keep the gains with a lighter rhythm of care and the habits that hold them.', color: '#D9BE82' },
]
/** When each completed step was reached (sample). Index 0 = Step 1. */
export const stageDates = ['Jun 10, 2026', 'Jul 6, 2026', 'Aug 17, 2026', 'Sep 21, 2026', 'Oct 19, 2026', 'Nov 16, 2026', 'Dec 14, 2026']
export const stageLabel = (n: number) => { const s = stages.find((x) => x.n === n); return s ? `Step ${s.n} · ${s.title}` : `Step ${n}` }

/* Actors: the root causes a patient is fighting. The lead actor is treated first. */
export const actorCatalog = ['Mold', 'Lyme', 'Long COVID', 'Heavy metals', 'Chronic viral infection', 'Mast cell activation', 'Gut dysbiosis', 'Nervous system dysregulation', 'Hormone imbalance', 'Toxin burden']

/* Pathways that change which rules apply (e.g. whether physician authorization is required). */
export const pathways = ['Complex Chronic', 'Chronic', 'Health Optimization'] as const
export type PathwayName = (typeof pathways)[number]

/* Rooms and devices, each with the eCW resource it maps to. Picking a location in the modality
   configuration sets the eCW resource automatically; nobody types the eCW name by hand. */
export const locations: { name: string; ecw: string; kind: 'Room' | 'Device' | 'Seat' }[] = [
  { name: 'ADA Nano Room', ecw: 'NANO-1', kind: 'Room' },
  { name: 'Nano Room 2', ecw: 'NANO-2', kind: 'Room' },
  { name: 'Suite B · Room 3 (Red light bed)', ecw: 'RLT-ROOM3', kind: 'Room' },
  { name: 'Suite B · Salt room', ecw: 'SALT', kind: 'Room' },
  { name: 'Suite B · Room 2 (BEMER / BioCharger)', ecw: 'BEMER', kind: 'Room' },
  { name: 'Suite A · Treatment 1 (Laser)', ecw: 'LASER', kind: 'Room' },
  { name: 'Suite A · Treatment 2 (RIFE)', ecw: 'RIFE', kind: 'Room' },
  { name: 'Suite B · Lounge · H2 stations', ecw: 'H2', kind: 'Seat' },
  { name: 'Suite B · Lounge · NanoVi', ecw: 'NANOVI', kind: 'Device' },
]
export const ecwFor = (location: string) => locations.find((l) => l.name === location)?.ecw ?? '—'

/* Where each sample patient is on the roadmap and which actors they are working on. */
export interface PatientPlan { stage: number; actors: string[]; leadActor?: string; pathway: PathwayName; updatedBy: string; updatedAt: string }
const plans: Record<string, PatientPlan> = {
  'P-0031': { stage: 3, actors: ['Mold', 'Lyme'], leadActor: 'Mold', pathway: 'Complex Chronic', updatedBy: 'Your provider', updatedAt: 'Oct 8, 2026' },
  'P-0041': { stage: 4, actors: ['Mold', 'Mast cell activation'], leadActor: 'Mold', pathway: 'Complex Chronic', updatedBy: 'Your provider', updatedAt: 'Oct 1, 2026' },
  'P-0043': { stage: 2, actors: ['Long COVID'], leadActor: 'Long COVID', pathway: 'Complex Chronic', updatedBy: 'Your provider', updatedAt: 'Oct 14, 2026' },
  'P-0044': { stage: 1, actors: [], pathway: 'Complex Chronic', updatedBy: 'Ana', updatedAt: 'Oct 15, 2026' },
  'P-0045': { stage: 1, actors: [], pathway: 'Health Optimization', updatedBy: 'Ana', updatedAt: 'Oct 16, 2026' },
  'P-0019': { stage: 7, actors: ['Lyme'], leadActor: 'Lyme', pathway: 'Complex Chronic', updatedBy: 'Your provider', updatedAt: 'Sep 30, 2026' },
}
export const planFor = (patientId: string): PatientPlan => plans[patientId] ?? { stage: 1, actors: [], pathway: 'Complex Chronic', updatedBy: 'Ana', updatedAt: 'Oct 1, 2026' }
/** The signed-in sample patient (Marisol A., P-0031). */
export const myPlan = planFor('P-0031')
