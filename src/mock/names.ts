import { patients } from './patients'
import { memberNames } from './program'

/** Full name for a patient ID. Staff work by name; the internal ID is shown as secondary text. */
const extra: Record<string, string> = { 'P-0034': 'Hannah Lindqvist', 'P-0022': 'Marcus Oyelaran' }
export function nameOf(id: string): string {
  const p = patients.find((x) => x.id === id)
  return p ? `${p.firstName} ${p.lastName}` : memberNames[id] ?? extra[id] ?? id
}
export const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
