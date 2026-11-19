/** Medications and supplements (sample data). Three separate facts are kept for each item:
 *  what was ordered, whether it was obtained, and what the patient reports actually taking.
 *  A patient report never changes the physician's order. */
export type MedKind = 'Medication' | 'Supplement'
export type MedSource = 'eCW prescription' | 'Fullscript' | 'Added by me'
export type MedStatus = 'Taking regularly' | 'Taking sometimes' | 'Not started' | 'Paused' | 'Stopped' | 'Chose not to take'

export interface Med {
  id: string
  name: string
  dose: string
  when: string
  kind: MedKind
  source: MedSource
  orderedBy: string
  ordered: string
  /** Obtained: a Fullscript delivery, a pharmacy fill, or unknown. Unknown is not the same as not filled. */
  obtained: string
  status: MedStatus
  frequency?: 'Most days' | 'Some days' | 'Rarely'
  started?: string
  reason?: string
  confirmed: string
  /** No confirmation for more than a month: keep the last answer, flag it. */
  stale?: boolean
  sinceLastVisit?: boolean
  note?: string
}

export const statuses: MedStatus[] = ['Taking regularly', 'Taking sometimes', 'Not started', 'Paused', 'Stopped', 'Chose not to take']
export const frequencies = ['Most days', 'Some days', 'Rarely'] as const
export const reasons = ['Possible reaction', 'I forgot', 'Cost', 'I have concerns about it', 'Hard to take', 'Could not get it', 'My doctor told me to', 'Other']
export const needsReason = (s: MedStatus) => s === 'Not started' || s === 'Paused' || s === 'Stopped' || s === 'Chose not to take'
export const statusTone = (s: MedStatus) => (s === 'Taking regularly' ? 'ok' : s === 'Taking sometimes' ? 'warn' : s === 'Not started' || s === 'Paused' ? 'neutral' : 'bad') as 'ok' | 'warn' | 'neutral' | 'bad'

export const lastVisit = 'Sep 21, 2026'
export const nextVisit = 'Oct 19, 2026'

export const seedMeds: Med[] = [
  { id: 'm1', name: 'Low-dose naltrexone', dose: '3 mg', when: 'Every night', kind: 'Medication', source: 'eCW prescription', orderedBy: 'Dr. D.', ordered: 'Jun 15, 2026', obtained: "Compounded at King's Pharmacy · fill status unknown", status: 'Taking regularly', started: 'Jun 17, 2026', confirmed: 'Oct 2, 2026', note: 'Dose increased from 1.5 mg by Dr. D. on Jul 13' },
  { id: 'm2', name: 'Cholestyramine', dose: '4 g', when: 'Once a day, away from other medicines', kind: 'Medication', source: 'eCW prescription', orderedBy: 'Dr. D.', ordered: 'Sep 21, 2026', obtained: 'Pharmacy fill status unknown', status: 'Taking sometimes', frequency: 'Some days', started: 'Sep 24, 2026', confirmed: 'Oct 2, 2026', sinceLastVisit: true },
  { id: 'm3', name: 'Levothyroxine', dose: '75 mcg', when: 'Every morning, empty stomach', kind: 'Medication', source: 'Added by me', orderedBy: 'Dr. Patel (another doctor)', ordered: 'Before the program', obtained: 'Reported by you', status: 'Taking regularly', started: 'Before the program', confirmed: 'Aug 20, 2026', stale: true },
  { id: 'm4', name: 'Ketotifen (compounded)', dose: '1 mg', when: 'Twice a day', kind: 'Medication', source: 'eCW prescription', orderedBy: 'Dr. D.', ordered: 'Sep 21, 2026', obtained: "Sent to King's Pharmacy · fill status unknown", status: 'Not started', reason: 'Could not get it', confirmed: 'Oct 2, 2026', sinceLastVisit: true },
  { id: 's1', name: 'Magnesium glycinate', dose: '400 mg', when: 'Every night', kind: 'Supplement', source: 'Fullscript', orderedBy: 'Dr. D.', ordered: 'Sep 21, 2026', obtained: 'Fullscript · delivered Sep 25, 2026', status: 'Taking regularly', started: 'Sep 26, 2026', confirmed: 'Oct 2, 2026', sinceLastVisit: true },
  { id: 's2', name: 'Vitamin D3', dose: '5,000 IU', when: 'Every morning', kind: 'Supplement', source: 'Fullscript', orderedBy: 'Dr. D.', ordered: 'Sep 21, 2026', obtained: 'Fullscript · delivered Sep 25, 2026', status: 'Taking regularly', started: 'Sep 27, 2026', confirmed: 'Oct 2, 2026', sinceLastVisit: true },
  { id: 's3', name: 'Binder blend', dose: '2 capsules', when: 'Before bed', kind: 'Supplement', source: 'Fullscript', orderedBy: 'Dr. D.', ordered: 'Sep 21, 2026', obtained: 'Fullscript · not purchased', status: 'Chose not to take', reason: 'I have concerns about it', confirmed: 'Oct 2, 2026', sinceLastVisit: true },
  { id: 's4', name: 'Quercetin', dose: '500 mg', when: 'With breakfast', kind: 'Supplement', source: 'Added by me', orderedBy: 'Started on my own', ordered: 'Oct 1, 2026', obtained: 'Reported by you', status: 'Taking regularly', started: 'Oct 1, 2026', confirmed: 'Oct 2, 2026', note: 'Your care team will review this with the rest of your list' },
]

/** Sample catalog for the assisted search when a patient adds an item. */
export const catalog = ['Quercetin 500 mg', 'Vitamin C 1,000 mg', 'Zinc picolinate 30 mg', 'Melatonin 3 mg', 'Cetirizine 10 mg', 'Famotidine 20 mg', 'Probiotic blend', 'Omega-3 2 g', 'Ibuprofen 200 mg']

const recommended = seedMeds.filter((m) => m.sinceLastVisit)
const isStarted = (m: Med) => m.status === 'Taking regularly' || m.status === 'Taking sometimes'
/** Plan vs. actual since the last visit, for the physician's pre-visit briefing. */
export const briefing = {
  recommended,
  started: recommended.filter(isStarted),
  notStarted: recommended.filter((m) => !isStarted(m)),
  other: seedMeds.filter((m) => m.source === 'Added by me' && m.ordered !== 'Before the program'),
  unconfirmed: seedMeds.filter((m) => m.stale),
  forToday: [
    'Clarify why the compounded ketotifen could not be obtained.',
    'Discuss the binder blend the patient chose not to take.',
    'Confirm how often cholestyramine is taken.',
    'Verify quercetin, started by the patient, against the rest of the list.',
    'Review the timing of treatments and medication changes against the flare and the crash. Timing is not proof of cause.',
  ],
}
