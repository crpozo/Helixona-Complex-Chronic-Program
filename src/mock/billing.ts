import { payments, members } from './program'

/* Membership plans, family plans, session lengths with prices, and payout reconciliation (sample data). */

/** A family plan: one payer, several members, one monthly charge. Pricing rules are still to be confirmed. */
export interface Family { id: string; name: string; payer: string; members: string[]; monthly: number; method: string; since: string; status: 'Active' | 'Payment failed' | 'Paused' }
export const families: Family[] = [
  { id: 'FAM-01', name: 'Vasquez family', payer: 'P-0031', members: ['P-0031', 'P-0050'], monthly: 3600, method: 'ACH •••• 9087', since: 'Jun 10, 2026', status: 'Active' },
  { id: 'FAM-02', name: 'Brooks family', payer: 'P-0028', members: ['P-0028', 'P-0051', 'P-0052'], monthly: 5100, method: 'Card •••• 2210', since: 'May 6, 2026', status: 'Payment failed' },
]
export const familyOf = (id: string) => families.find((f) => f.members.includes(id))
export const planOf = (id: string) => { const f = familyOf(id); return f ? (f.payer === id ? `${f.name} · payer` : `${f.name} · member`) : 'Individual' }
export const membershipOf = (id: string) => members.find((m) => m.id === id)?.status ?? '—'
export const lastPaidOf = (id: string) => payments.filter((p) => p.patientId === id && p.status === 'Paid').sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0]

/** Session lengths a modality is sold in, each with its price. Booking uses these as the time increments. */
export const sessionOptions: Record<string, { min: number; price: number }[]> = {
  'MOD-01': [{ min: 15, price: 40 }, { min: 20, price: 50 }, { min: 30, price: 65 }],
  'MOD-02': [{ min: 15, price: 55 }, { min: 20, price: 70 }, { min: 30, price: 85 }, { min: 45, price: 95 }],
  'MOD-10': [{ min: 15, price: 55 }, { min: 20, price: 70 }, { min: 30, price: 85 }, { min: 45, price: 95 }],
  'MOD-03': [{ min: 30, price: 35 }, { min: 45, price: 45 }],
  'MOD-04': [{ min: 10, price: 25 }, { min: 20, price: 40 }],
  'MOD-05': [{ min: 15, price: 90 }, { min: 30, price: 150 }],
  'MOD-06': [{ min: 30, price: 35 }, { min: 60, price: 55 }],
  'MOD-07': [{ min: 15, price: 30 }, { min: 30, price: 50 }],
  'MOD-08': [{ min: 30, price: 70 }, { min: 45, price: 95 }],
  'MOD-09': [{ min: 10, price: 25 }, { min: 20, price: 40 }],
}

/** Stripe payouts against the bank statement. */
export interface Payout { date: string; charges: number; gross: number; fees: number; refunds: number; net: number; bank: 'Matched' | 'Not found in bank' | 'Amount differs'; note?: string }
export const payouts: Record<string, Payout[]> = {
  'October 2026': [
    { date: 'Oct 3, 2026', charges: 1, gross: 1500, fees: 44, refunds: 0, net: 1456, bank: 'Matched' },
    { date: 'Oct 9, 2026', charges: 1, gross: 2000, fees: 58, refunds: 0, net: 1942, bank: 'Matched' },
    { date: 'Oct 12, 2026', charges: 2, gross: 4000, fees: 21, refunds: 2000, net: 1979, bank: 'Amount differs', note: 'Bank shows $1,959 · $20 dispute fee not in the app' },
    { date: 'Oct 14, 2026', charges: 1, gross: 3600, fees: 5, refunds: 0, net: 3595, bank: 'Not found in bank', note: 'ACH payout still in transit · expected Oct 16' },
  ],
  'September 2026': [
    { date: 'Sep 4, 2026', charges: 2, gross: 4000, fees: 63, refunds: 0, net: 3937, bank: 'Matched' },
    { date: 'Sep 11, 2026', charges: 1, gross: 2000, fees: 5, refunds: 0, net: 1995, bank: 'Matched' },
    { date: 'Sep 18, 2026', charges: 1, gross: 1500, fees: 44, refunds: 0, net: 1456, bank: 'Matched' },
  ],
}
