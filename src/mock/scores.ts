/* Check-in scores over time with the things that may explain them: therapies, prescription changes, crashes.
   Sample data, generated the same way every time so the charts are stable. "Today" in the mockup is Oct 9, 2026. */
export const TODAY = '2026-10-09'
export interface ScorePoint { date: string; energy: number; pain: number; sleep: number; digestion: number }
export type EventKind = 'crash' | 'flare' | 'therapy' | 'rx' | 'baseline'
/** The clinic's definitions, shown to patients when they report and to staff as a reminder. */
export const definitions = {
  flare: { title: 'Flare — My symptoms have gotten worse', text: "I'm experiencing an increase in symptoms, such as pain, inflammation, digestive issues, or brain fog, but I can still manage most of my daily activities, even if they're harder than usual." },
  crash: { title: 'Crash — My ability to function has significantly declined', text: 'My symptoms have become overwhelming, leaving me with very limited energy or ability to function. I may struggle to get out of bed, care for myself, or complete basic daily activities.' },
}
export interface ScoreEvent { date: string; kind: EventKind; label: string; modality?: string; detail?: string }

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)))
function rng(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 } }
const addDays = (iso: string, d: number) => { const t = new Date(iso + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10) }

const eventsBase: ScoreEvent[] = [
  { date: '2026-06-08', kind: 'baseline', label: 'Baseline' },
  { date: '2026-06-15', kind: 'rx', label: 'LDN started', detail: 'Low-dose naltrexone 1.5 mg nightly' },
  { date: '2026-06-22', kind: 'therapy', label: 'Red light #1', modality: 'Red light therapy' },
  { date: '2026-07-06', kind: 'therapy', label: 'Hydrogen nano bath #1', modality: 'Hydrogen nano bath' },
  { date: '2026-07-13', kind: 'rx', label: 'LDN increased', detail: '1.5 mg → 3 mg nightly' },
  { date: '2026-07-20', kind: 'therapy', label: 'Salt room #1', modality: 'Salt room' },
  { date: '2026-07-27', kind: 'flare', label: 'Flare', detail: 'Affecting daily activities moderately · joint pain' },
  { date: '2026-08-03', kind: 'crash', label: 'Crash', detail: 'Affecting daily activities extremely · after travel' },
  { date: '2026-08-10', kind: 'therapy', label: 'Red light #4', modality: 'Red light therapy' },
  { date: '2026-08-24', kind: 'rx', label: 'Binder added', detail: 'Cholestyramine 4 g daily' },
  { date: '2026-08-31', kind: 'therapy', label: 'Hydrogen nano bath #4', modality: 'Hydrogen nano bath' },
  { date: '2026-09-14', kind: 'therapy', label: 'IV therapy #1', modality: 'IV therapy' },
  { date: '2026-09-22', kind: 'therapy', label: 'Erchonia laser #1', modality: 'Erchonia laser' },
  { date: '2026-09-28', kind: 'rx', label: 'Sleep aid stopped', detail: 'Trazodone discontinued' },
  { date: '2026-10-05', kind: 'therapy', label: 'Hydrogen nano bath #7', modality: 'Hydrogen nano bath' },
  { date: '2026-10-02', kind: 'flare', label: 'Flare', detail: 'Affecting daily activities a lot · pain and digestive issues' },
  { date: '2026-10-08', kind: 'crash', label: 'Crash', detail: 'Started as a flare on Oct 2 · dizzy, heart racing' },
]

export function scoresFor(id: string): { points: ScorePoint[]; events: ScoreEvent[] } {
  const r = rng([...id].reduce((n, c) => n * 31 + c.charCodeAt(0), 7))
  const points: ScorePoint[] = []
  const dates: string[] = []
  for (let d = '2026-06-08'; d <= '2026-09-28'; d = addDays(d, 7)) dates.push(d)
  for (let d = '2026-10-01'; d <= '2026-10-08'; d = addDays(d, 1)) dates.push(d)
  dates.forEach((date, i) => {
    const t = i / (dates.length - 1)
    let energy = 3 + 3.2 * t + (r() - 0.5) * 1.6, pain = 7 - 3 * t + (r() - 0.5) * 1.6, sleep = 4 + 2.4 * t + (r() - 0.5) * 1.6, digestion = 4 + 2.8 * t + (r() - 0.5) * 1.8
    if (date === '2026-08-03') { energy -= 2.5; pain += 2.5; sleep -= 1.5 }
    if (date === '2026-10-02') { pain += 3; digestion -= 3 }
    if (date === '2026-07-27') { pain += 2; digestion -= 1.5 }
    if (date === '2026-10-08') { energy -= 3.5; pain += 1.5; sleep -= 3 }
    points.push({ date, energy: clamp(energy), pain: clamp(pain), sleep: clamp(sleep), digestion: clamp(digestion) })
  })
  return { points, events: eventsBase }
}
export const fmtDay = (iso: string, withYear = false) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' })
export const shiftDays = addDays
