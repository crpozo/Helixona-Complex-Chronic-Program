import type { EcwJob } from './types'

export const ecwJobs: EcwJob[] = [
  { id: 'JOB-5121', type: 'J2 · Intake note + PDF', patientId: 'P-0039', queuedAt: 'Oct 5, 2026 · 6:00 AM', failedStep: 'Step 7 · PDF read-back', detail: 'Note was pasted and verified (marker HLX:INT-2039:v2 found). PDF upload returned success but the document could not be found in Patient Docs on read-back. Stopped before marking "Placed in eCW".', severity: 'critical', attempts: 1, status: 'open' },
  { id: 'JOB-5118', type: 'J3 · Booking mirror', patientId: 'P-0041', queuedAt: 'Oct 4, 2026 · 2:31 PM', failedStep: 'Step 3 · Create appointment', detail: 'eCW slot for Nano Bath Room 2 on Oct 9 at 10:00 AM is already taken by a manual booking. The patient\'s reservation in this app remains valid; staff must move the eCW appointment or free the slot.', severity: 'warning', attempts: 1, status: 'open' },
  { id: 'JOB-5102', type: 'J2 · Intake note + PDF', patientId: 'P-0041', queuedAt: 'Sep 16, 2026 · 6:00 AM', failedStep: '—', detail: 'Completed and verified. Closed automatically.', severity: 'warning', attempts: 1, status: 'closed' },
  { id: 'JOB-5097', type: 'J4 · Schedule read-back', patientId: 'P-0044', queuedAt: 'Sep 15, 2026 · 5:30 AM', failedStep: 'Step 1 · Sign in', detail: 'eCW sign-in page changed; connector could not find the password field. Fixed by technical admin on Sep 15; closed manually.', severity: 'warning', attempts: 2, status: 'closed' },
]
